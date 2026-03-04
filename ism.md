# ISM (Combined PDF) — Module-wise Formulas + How to Solve

Source: `edited_ISM_combined4.pdf` (270 pages).

Note: Some slides are image-heavy / formatting-heavy; where text extraction was incomplete, I used the standard formula that the surrounding examples/steps clearly imply (and kept it consistent with the slide’s notation/style).

---

## Module 1 — Basic Probability & Statistics

### Core descriptive statistics
- Mean (sample):
  $$\bar{x} = \frac{1}{n}\sum_{i=1}^n x_i$$
- Population variance / standard deviation:
  $$\sigma^2 = \frac{1}{N}\sum_{i=1}^N (x_i-\mu)^2, \quad \sigma = \sqrt{\sigma^2}$$
- Sample variance / standard deviation (unbiased for population variance):
  $$s^2 = \frac{1}{n-1}\sum_{i=1}^n (x_i-\bar{x})^2, \quad s = \sqrt{s^2}$$
- Five-number summary:
  - Minimum, $Q_1$ (25%), Median, $Q_3$ (75%), Maximum
- Interquartile range (IQR) and quartile deviation:
  $$\text{IQR} = Q_3 - Q_1, \quad \text{QD} = \frac{\text{IQR}}{2}$$

### Core probability
- Axioms:
  $$P(S)=1,\quad 0\le P(E)\le 1,\quad E_1\cap E_2=\varnothing \Rightarrow P(E_1\cup E_2)=P(E_1)+P(E_2)$$
- Complement:
  $$P(A^c)=1-P(A)$$
- Addition rule:
  $$P(A\cup B)=P(A)+P(B)-P(A\cap B)$$
  If $A$ and $B$ are mutually exclusive, $P(A\cap B)=0$ so $P(A\cup B)=P(A)+P(B)$.
- Independence:
  $$A\perp B \iff P(A\cap B)=P(A)P(B)$$

### How to solve typical questions (Module 1)

**A) Compute sample variance / standard deviation**
1. Compute $\bar{x}$.
2. Compute deviations $x_i-\bar{x}$ and squared deviations $(x_i-\bar{x})^2$.
3. Sum the squared deviations: $SS=\sum (x_i-\bar{x})^2$.
4. Use $s^2=SS/(n-1)$ and $s=\sqrt{s^2}$.

**B) Probability of “A or B”, “exactly one”, “neither”**
1. Translate words to sets: “or” $\to \cup$, “and” $\to \cap$, “not” $\to (\cdot)^c$.
2. Use the addition rule for $P(A\cup B)$.
3. “Exactly one” is $P(A\cap B^c)+P(A^c\cap B)=P(A)+P(B)-2P(A\cap B)$.
4. “Neither” is $P((A\cup B)^c)=1-P(A\cup B)$.

### Simple example (Module 1)
A student passes Statistics with probability $P(S)=2/3$. They fail Mathematics with probability $5/9$, so $P(M)=1-5/9=4/9$. If $P(S\cup M)=4/5$, find $P(S\cap M)$.

Use:
$$P(S\cup M)=P(S)+P(M)-P(S\cap M)$$
So
$$P(S\cap M)=\frac{2}{3}+\frac{4}{9}-\frac{4}{5}=\frac{14}{45}.$$

---

## Module 2 — Conditional Probability & Bayes’ Theorem (incl. Naive Bayes)

### Core formulas
- Conditional probability:
  $$P(A\mid B)=\frac{P(A\cap B)}{P(B)}\quad (P(B)>0)$$
- Multiplication rule:
  $$P(A\cap B)=P(A\mid B)P(B)=P(B\mid A)P(A)$$
- Law of total probability (partition $E_1,\dots,E_n$):
  $$P(A)=\sum_{i=1}^n P(E_i)P(A\mid E_i)$$
- Bayes’ theorem:
  $$P(E_i\mid A)=\frac{P(E_i)P(A\mid E_i)}{\sum_{j=1}^n P(E_j)P(A\mid E_j)}$$
- Bayes for hypotheses (common ML phrasing):
  $$P(H\mid E)=\frac{P(E\mid H)P(H)}{P(E)}$$

### Naive Bayes classifier (conditional independence assumption)
Given class $Y\in\{c_1,\dots,c_K\}$ and features $X=(x_1,\dots,x_n)$:
- Bayes rule:
  $$P(Y=c_k\mid X)\propto P(Y=c_k)P(X\mid Y=c_k)$$
- Naive assumption:
  $$P(X\mid Y=c_k)=\prod_{i=1}^n P(x_i\mid Y=c_k)$$
- MAP decision:
  $$\hat{y}=\arg\max_k\; P(Y=c_k)\prod_{i=1}^n P(x_i\mid Y=c_k)$$

### How to solve typical questions (Module 2)

**A) Total probability + Bayes**
1. Identify hypotheses/events $E_1,\dots,E_n$ that partition the sample space.
2. Compute $P(A)$ using total probability: $P(A)=\sum P(E_i)P(A\mid E_i)$.
3. Plug into Bayes: $P(E_i\mid A)=\frac{P(E_i)P(A\mid E_i)}{P(A)}$.

**B) Naive Bayes from a small dataset (frequency table approach)**
1. Convert raw labeled data into counts (frequency table) for each feature value within each class.
2. Convert counts to probabilities $P(x_i\mid Y)$ and class priors $P(Y)$.
3. Multiply (or sum logs): score$_k = P(Y=c_k)\prod_i P(x_i\mid Y=c_k)$.
4. Choose the class with highest score.
5. If any probability becomes 0, apply Laplace smoothing (add 1 to counts).

### Simple example (Module 2)
Email spam classification using Bayes:
- $P(\text{Spam})=0.3$, $P(\text{NotSpam})=0.7$
- $P(\text{offer}\mid \text{Spam})=0.8$, $P(\text{offer}\mid \text{NotSpam})=0.1$

Find $P(\text{Spam}\mid \text{offer})$:
$$P(\text{Spam}\mid \text{offer})=\frac{0.8\cdot 0.3}{0.8\cdot 0.3+0.1\cdot 0.7}=\frac{0.24}{0.31}=0.774.$$

---

## Module 3 — Probability Distributions

### Random variables, pmf/pdf, cdf
- Discrete RV: probability mass function (pmf) $p_X(x)=P(X=x)$
- Continuous RV: probability density function (pdf) $f_X(x)$ with $P(a\le X\le b)=\int_a^b f_X(x)\,dx$
- CDF (both cases):
  $$F_X(x)=P(X\le x)$$

### Expectation and variance
- Discrete:
  $$\mathbb{E}[X]=\sum_x x\,p_X(x),\quad \mathrm{Var}(X)=\mathbb{E}[X^2]-(\mathbb{E}[X])^2$$
- Continuous:
  $$\mathbb{E}[X]=\int_{-\infty}^{\infty} x f_X(x)\,dx$$

### Bernoulli($p$)
- PMF ($x\in\{0,1\}$):
  $$P(X=x)=p^x(1-p)^{1-x}$$
- Mean/variance:
  $$\mathbb{E}[X]=p,\quad \mathrm{Var}(X)=p(1-p)$$

### Binomial($n,p$)
- PMF:
  $$P(X=x)=\binom{n}{x}p^x(1-p)^{n-x},\quad x=0,1,\dots,n$$
- Mean/variance:
  $$\mathbb{E}[X]=np,\quad \mathrm{Var}(X)=np(1-p)$$

### Poisson($\lambda$)
- PMF:
  $$P(X=x)=e^{-\lambda}\frac{\lambda^x}{x!},\quad x=0,1,2,\dots$$
- Mean/variance:
  $$\mathbb{E}[X]=\lambda,\quad \mathrm{Var}(X)=\lambda$$
- Poisson approximation to Binomial: when $n$ large, $p$ small, use $\lambda=np$.

### Normal distribution and standardization
- $X\sim\mathcal{N}(\mu,\sigma^2)$, standardize via
  $$Z=\frac{X-\mu}{\sigma}\sim\mathcal{N}(0,1)$$

### Normal approximation to Binomial (with continuity correction)
If $X\sim\mathrm{Bin}(n,p)$ and $np\ge 15$, $n(1-p)\ge 15$, then
- Approximate with $\mathcal{N}(\mu=np,\sigma^2=np(1-p))$
- Apply continuity correction (examples):
  - $P(X\le c)\approx P\big(Z\le \frac{c+0.5-\mu}{\sigma}\big)$
  - $P(X\ge c)\approx P\big(Z\ge \frac{c-0.5-\mu}{\sigma}\big)$

### Chi-square and t (as used in inference)
- If $Z_1,\dots,Z_k\overset{iid}{\sim}\mathcal{N}(0,1)$, then
  $$\sum_{i=1}^k Z_i^2 \sim \chi^2_k$$
- If $Z\sim\mathcal{N}(0,1)$ and $V\sim\chi^2_\nu$ independent, then
  $$T=\frac{Z}{\sqrt{V/\nu}}\sim t_\nu$$

### How to solve typical questions (Module 3)

**A) Pick the right distribution**
1. Identify the random variable: what is being counted/measured?
2. Check conditions:
   - Bernoulli: single trial success/failure
   - Binomial: $n$ fixed, independent trials, constant $p$
   - Poisson: counts in time/space with mean rate $\lambda$; or binomial approx ($n$ large, $p$ small)
   - Normal: continuous measurements or via CLT/approximation
3. Compute the required probability using the PMF/PDF/CDF.

**B) Normal probabilities**
1. Convert $X$ to $Z=(X-\mu)/\sigma$.
2. Use standard normal CDF values.

### Simple example (Module 3)
Ten fair coins are tossed. Let $X$ be number of heads. Find $P(X\le 3)$.

Here $X\sim\mathrm{Bin}(n=10,p=0.5)$:
$$P(X\le 3)=\sum_{x=0}^3 \binom{10}{x}(0.5)^{10}.$$

---

## Module 4 — Hypothesis Testing (with Estimation, CI, ANOVA, MLE)

### Confidence intervals (CI)
- CI for mean (large sample or $\sigma$ known):
  $$\bar{x} \pm z_{\alpha/2}\frac{\sigma}{\sqrt{n}}$$
- CI for mean ($\sigma$ unknown, normal population / small $n$):
  $$\bar{x} \pm t_{\alpha/2,\,n-1}\frac{s}{\sqrt{n}}$$

### Hypothesis testing essentials
- Typical steps:
  1. State $H_0$ and $H_1$ (left / right / two-tailed)
  2. Pick significance level $\alpha$ (e.g., 0.05)
  3. Compute test statistic
  4. Compute p-value **or** compare to critical value
  5. Reject / fail to reject $H_0$, write conclusion in context

### Z tests (common forms)
- One mean ($\sigma$ known):
  $$z=\frac{\bar{x}-\mu_0}{\sigma/\sqrt{n}}$$
- One proportion (with large-sample conditions):
  $$z=\frac{\hat{p}-p_0}{\sqrt{p_0(1-p_0)/n}}$$

### Chi-square test of independence (contingency table)
- Expected count:
  $$E_{ij}=\frac{(\text{row }i\text{ total})(\text{col }j\text{ total})}{n}$$
- Test statistic:
  $$\chi^2=\sum_{i}\sum_{j}\frac{(O_{ij}-E_{ij})^2}{E_{ij}}$$
- Degrees of freedom: $(r-1)(c-1)$.

### One-way ANOVA
- Hypotheses:
  $$H_0: \mu_1=\cdots=\mu_k \quad\text{vs}\quad H_1:\text{at least one mean differs}$$
- Sums of squares (as used in the slides):
  - SSTR: between-treatments
  - SSE: within (error)
  - SST: total, with $\text{SST} = \text{SSTR} + \text{SSE}$
- Degrees of freedom:
  - Between: $k-1$
  - Within: $n-k$
- Mean squares:
  $$\text{MSTR}=\frac{\text{SSTR}}{k-1},\quad \text{MSE}=\frac{\text{SSE}}{n-k}$$
- F ratio:
  $$F=\frac{\text{MSTR}}{\text{MSE}}$$

### Two-way ANOVA (structure)
Compute correction factor, then:
- Total sum of squares $\text{SST}$
- Treatment sum of squares $\text{SSTR}$
- Block sum of squares $\text{SSBL}$
- Error sum of squares $\text{SSE}=\text{SST}-\text{SSTR}-\text{SSBL}$
Then compute mean squares and compare F values for treatments/blocks.

### Maximum likelihood estimation (MLE) quick results
- Bernoulli($p$):
  $$\hat{p}_{\text{MLE}}=\frac{1}{n}\sum_{i=1}^n x_i$$
- Poisson($\lambda$):
  $$\hat{\lambda}_{\text{MLE}}=\bar{x}$$
- Normal($\mu,\sigma^2$):
  $$\hat{\mu}=\bar{x},\quad \hat{\sigma}^2=\frac{1}{n}\sum_{i=1}^n (x_i-\bar{x})^2$$

### How to solve typical questions (Module 4)

**A) Z-test for a mean ($\sigma$ known)**
1. State $H_0: \mu=\mu_0$ and $H_1$.
2. Compute $z=(\bar{x}-\mu_0)/(\sigma/\sqrt{n})$.
3. Compute p-value using standard normal table (one/two-tailed).
4. If p-value $<\alpha$, reject $H_0$.

**B) Chi-square independence test**
1. Build contingency table with observed counts $O_{ij}$.
2. Compute expected counts $E_{ij}$.
3. Compute $\chi^2=\sum (O-E)^2/E$.
4. df = $(r-1)(c-1)$, compare to critical value or use p-value.

**C) One-way ANOVA**
1. Compute group means and grand mean.
2. Compute SSTR and SSE (or use correction factor method).
3. Compute F and compare with $F_{\alpha;(k-1,n-k)}$.

### Simple example (Module 4)
A sample of $n=30$ milk cartons has mean $\bar{x}=505$ ml. Assume population SD $\sigma=10$ ml. Test $H_0:\mu=500$ vs $H_1:\mu\ne 500$ at $\alpha=0.05$.

$$z=\frac{505-500}{10/\sqrt{30}}\approx \frac{5}{1.826}=2.74$$
Two-tailed p-value $\approx 0.006$ (small), so reject $H_0$.

---

## Module 5 — Prediction & Forecasting (Time Series + Regression Basics)

### Covariance and correlation
- Covariance:
  $$\mathrm{Cov}(X,Y)=\mathbb{E}[(X-\mu_X)(Y-\mu_Y)]=\mathbb{E}[XY]-\mathbb{E}[X]\,\mathbb{E}[Y]$$
- Autocovariance (time series $\{Y_t\}$, lag $h$):
  $$\gamma(h)=\mathrm{Cov}(Y_t,Y_{t+h})$$

### Simple linear regression (one predictor)
Model:
$$Y=a+bX+e$$
Common closed forms:
- Slope:
  $$b=\frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sum (x_i-\bar{x})^2}$$
- Intercept:
  $$a=\bar{y}-b\bar{x}$$

### Time series decomposition (components)
- Additive model:
  $$y_t = T_t + C_t + S_t + I_t$$
- Multiplicative model:
  $$y_t = T_t\times C_t\times S_t\times I_t$$
  Taking log turns it additive.

### Simple exponential smoothing
- Initialize: $F_2=Y_1$
- Update:
  $$F_{t+1}=\alpha Y_t + (1-\alpha)F_t,\quad 0<\alpha<1$$

Common error terms:
- Forecast error: $e_t=Y_t-F_t$
- Mean squared error (MSE): average of $e_t^2$ over the evaluation window

### How to solve typical questions (Module 5)

**A) Fit a simple linear regression and predict**
1. Compute $\bar{x},\bar{y}$.
2. Compute slope $b$ and intercept $a$.
3. Predict: $\hat{y}=a+b x_\text{new}$.

**B) Exponential smoothing forecast**
1. Pick $\alpha$ (larger $\alpha$ reacts faster to sudden changes).
2. Initialize $F_2=Y_1$.
3. Iterate $F_{t+1}=\alpha Y_t+(1-\alpha)F_t$.
4. Output forecast for next period.

### Simple example (Module 5)
Weekly demand (TB) for weeks 1–6: $[112,118,125,121,130,142]$. Use $\alpha=0.3$ and $F_1=Y_1=112$. Compute forecast for week 7.

Using $F_{t+1}=\alpha Y_t + (1-\alpha)F_t$:
- $F_2=112$
- $F_3=0.3\cdot 118 + 0.7\cdot 112 = 113.8$
- $F_4=0.3\cdot 125 + 0.7\cdot 113.8 = 117.16$
- $F_5=0.3\cdot 121 + 0.7\cdot 117.16 = 118.31$
- $F_6=0.3\cdot 130 + 0.7\cdot 118.31 = 121.82$
- $F_7=0.3\cdot 142 + 0.7\cdot 121.82 \approx 127.87$

---

## Module 6 — Forecasting + Gaussian Mixture Model (GMM) & EM

### Gaussian mixture model (GMM)
A $K$-component mixture model:
$$p(x)=\sum_{k=1}^K \pi_k\,\mathcal{N}(x\mid \mu_k,\Sigma_k)$$
where mixing coefficients satisfy $\pi_k\ge 0$ and $\sum_k \pi_k=1$.

For 1D Gaussian ($\sigma^2$):
$$\mathcal{N}(x\mid \mu,\sigma^2)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\Big(-\frac{(x-\mu)^2}{2\sigma^2}\Big)$$

### Latent variables and responsibilities
Using a 1-of-$K$ latent indicator $z$:
- Prior: $P(z_k=1)=\pi_k$
- Responsibility (posterior cluster probability):
  $$\gamma_{nk}=P(z_k=1\mid x_n)=\frac{\pi_k\,\mathcal{N}(x_n\mid\mu_k,\Sigma_k)}{\sum_{j=1}^K \pi_j\,\mathcal{N}(x_n\mid\mu_j,\Sigma_j)}$$

### EM algorithm for GMM (standard updates)
Given responsibilities $\gamma_{nk}$:
- Effective cluster sizes:
  $$N_k=\sum_{n=1}^N \gamma_{nk}$$
- Mixing coefficients:
  $$\pi_k=\frac{N_k}{N}$$
- Means:
  $$\mu_k=\frac{1}{N_k}\sum_{n=1}^N \gamma_{nk} x_n$$
- Covariances:
  $$\Sigma_k=\frac{1}{N_k}\sum_{n=1}^N \gamma_{nk}(x_n-\mu_k)(x_n-\mu_k)^T$$

EM loop:
1. Initialize $(\pi_k,\mu_k,\Sigma_k)$.
2. **E-step**: compute $\gamma_{nk}$.
3. **M-step**: update $(\pi_k,\mu_k,\Sigma_k)$.
4. Stop when log-likelihood change is below threshold.

### How to solve typical questions (Module 6)

**A) Responsibility for a 2-component 1D GMM**
1. Compute the two Gaussian densities $\mathcal{N}(x\mid\mu_1,\sigma_1^2)$ and $\mathcal{N}(x\mid\mu_2,\sigma_2^2)$.
2. Weight by priors $\pi_1,\pi_2$.
3. Normalize: $\gamma_1=\frac{\pi_1\mathcal{N}_1}{\pi_1\mathcal{N}_1+\pi_2\mathcal{N}_2}$.

**B) One EM iteration (2 components)**
1. E-step: compute $\gamma_{n1},\gamma_{n2}$ for each data point.
2. M-step: compute $N_1,N_2$ then update $\pi_k,\mu_k,(\sigma_k^2\text{ or }\Sigma_k)$.

### Simple example (Module 6)
Two-component 1D GMM:
- $\pi_1=0.6$, $\pi_2=0.4$
- $\mu_1=90$, $\mu_2=100$
- $\sigma_1^2=\sigma_2^2=25$ (so $\sigma=5$)

For $x=95$, compute $\gamma_1=P(z_1=1\mid x)$.

Because $|95-90|=|95-100|=5$ and variances match, the two Gaussian densities are equal, so
$$\gamma_1=\frac{0.6}{0.6+0.4}=0.6.$$
