import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { AppSettings } from "../types";
import { getSettings, getTodayDate, getDailyLog } from "./storage";
import { APP_NAME, NOTIFICATION_CHANNEL_ID, NOTIFICATION_CHANNEL_NAME } from "../common/constants";

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log("Must use physical device for notifications");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: NOTIFICATION_CHANNEL_NAME,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF7B00",
    });
  }

  return true;
};

export const scheduleDailyReminder = async (
  settings: AppSettings,
): Promise<string | null> => {
  try {
    // Cancel existing notifications first
    await cancelAllNotifications();

    if (!settings.notificationEnabled) {
      return null;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Get today's calorie intake for the notification message
    const todayLog = await getDailyLog(getTodayDate());
    const todayCalories = todayLog?.totalCalories || 0;

    const trigger: Notifications.NotificationTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.notificationTime.hour,
      minute: settings.notificationTime.minute,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🍽️ Log Your Meals!",
        body: `आज आपण किती कॅलरी घेतल्या ते नोंदवा! (Today's intake: ${todayCalories} cal)`,
        data: { type: NOTIFICATION_CHANNEL_ID },
        sound: true,
      },
      trigger,
    });

    console.log("Notification scheduled:", notificationId);
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("All notifications cancelled");
  } catch (error) {
    console.error("Error cancelling notifications:", error);
  }
};

export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Error getting scheduled notifications:", error);
    return [];
  }
};

// Send immediate notification (for testing)
export const sendTestNotification = async (): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🍽️ Test Notification",
      body: `This is a test notification for the ${APP_NAME} app!`,
      data: { type: "test" },
    },
    trigger: null, // Send immediately
  });
};

// Setup notification listener
export const setupNotificationListener = (
  onNotificationReceived: (notification: Notifications.Notification) => void,
) => {
  const subscription = Notifications.addNotificationReceivedListener(
    onNotificationReceived,
  );
  return () => subscription.remove();
};

export const setupNotificationResponseListener = (
  onNotificationResponse: (
    response: Notifications.NotificationResponse,
  ) => void,
) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    onNotificationResponse,
  );
  return () => subscription.remove();
};
