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

### Symbol guide & intuition (Module 1)

| Symbol | Read as | Meaning / intuition |
|---|---|---|
| $n$ | "sample size" | Number of observations you collected (sample) |
| $N$ | "population size" | Number of items in the full population (often unknown/huge) |
| $\bar{x}$ | "x-bar" | Sample mean (average of the sample) |
| $\mu$ | "mu" | Population mean (true average, usually unknown) |
| $s^2,\ s$ | "sample variance/std" | Spread in the sample; uses $n-1$ for unbiased variance estimate |
| $\sigma^2,\ \sigma$ | "population variance/std" | True population spread (parameter) |
| $A^c$ | "A complement" | "not A" |
| $\cup,\ \cap$ | union / intersection | "A or B" / "A and B" |
| $A\perp B$ | "A independent B" | Knowing $B$ does not change the probability of $A$ |

**Analogy — Variance as average squared distance:**
Think of the mean as the "center". Variance is the average squared distance of points from that center.

**Breakdown — sample variance formula:**

$$
s^2 = \frac{1}{n-1}\sum_{i=1}^n (x_i-\bar{x})^2
$$

- Compute $\bar{x}$
- Compute deviations $x_i-\bar{x}$
- Square and add them up (that sum is often called $SS$)
- Divide by $n-1$

### steps(Module 1)

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

### Worked examples (Module 1)

**Example 1A — Compute sample variance and standard deviation**

Data: $x = [2, 4, 6]$.

Step 1: $\bar{x}=(2+4+6)/3=4$.

Step 2: Deviations: $[-2, 0, 2]$. Squared deviations: $[4, 0, 4]$.

Step 3: $SS=4+0+4=8$.

Step 4:

$$
s^2 = \frac{SS}{n-1} = \frac{8}{2} = 4,\quad s = \sqrt{4}=2
$$

**Answer:** $s^2=4$, $s=2$.

**Example 1B — “A or B”, “exactly one”, “neither”**

Suppose $P(A)=0.6$, $P(B)=0.5$, $P(A\cap B)=0.3$.

Addition rule:

$$
P(A\cup B)=0.6+0.5-0.3=0.8
$$

Exactly one:

$$
P(\text{exactly one})=P(A)+P(B)-2P(A\cap B)=1.1-0.6=0.5
$$

Neither:

$$
P(\text{neither}) = 1 - P(A\cup B) = 0.2
$$

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

### Symbol guide & intuition (Module 2)

| Symbol | Read as | Meaning / intuition |
|---|---|---|
| $P(A\mid B)$ | "probability of A given B" | Probability after you learn $B$ happened |
| $P(A\cap B)$ | "A and B" | Both events happen |
| $E_1,\dots,E_n$ | partition events | Mutually exclusive cases that cover all possibilities |
| Prior $P(H)$ | "prior" | Belief before seeing evidence |
| Likelihood $P(E\mid H)$ | "likelihood" | How compatible the evidence is with the hypothesis |
| Posterior $P(H\mid E)$ | "posterior" | Updated belief after evidence |
| $\hat{y}$ | "y-hat" | Predicted class label |
| $\arg\max$ | "arg max" | The input value that makes an expression largest |

**Analogy — Bayes as "flip your viewpoint":**
Instead of asking "how likely is evidence if hypothesis is true" ($P(E\mid H)$), Bayes lets you compute "how likely is the hypothesis given evidence" ($P(H\mid E)$).

**Breakdown — Bayes’ theorem (2-hypothesis case):**

$$
P(H_1\mid E)=\frac{P(E\mid H_1)P(H_1)}{P(E\mid H_1)P(H_1)+P(E\mid H_2)P(H_2)}
$$

### steps(Module 2)

**A) Total probability + Bayes**
1. Identify hypotheses/events $E_1,\dots,E_n$ that partition the sample space.
2. Compute $P(A)$ using total probability: $P(A)=\sum P(E_i)P(A\mid E_i)$.
3. Plug into Bayes: $P(E_i\mid A)=\frac{P(E_i)P(A\mid E_i)}{P(A)}$.

**B) Naive Bayes from a small dataset (frequency table approach)**
1. Convert raw labeled data into counts (frequency table) for each feature value within each class.
2. Convert counts to probabilities $P(x_i\mid Y)$ and class priors $P(Y)$.
3. Multiply (or sum logs): $\mathrm{score}_k = P(Y=c_k)\prod_i P(x_i\mid Y=c_k)$.
4. Choose the class with highest score.
5. If any probability becomes 0, apply Laplace smoothing (add 1 to counts).

### Worked examples (Module 2)

**Example 2A — Total probability + Bayes (factory / defect style)**

Two machines make a part:
- $P(M_1)=0.6$, $P(\text{Def}\mid M_1)=0.02$
- $P(M_2)=0.4$, $P(\text{Def}\mid M_2)=0.05$

Find $P(M_2\mid \text{Def})$.

Step 1: Total probability:

$$
P(\text{Def})=0.6\cdot 0.02 + 0.4\cdot 0.05 = 0.012+0.020 = 0.032
$$

Step 2: Bayes:

$$
P(M_2\mid \text{Def})=\frac{0.4\cdot 0.05}{0.032}=\frac{0.020}{0.032}=0.625
$$

**Answer:** $P(M_2\mid \text{Def})=0.625$.

**Example 2B — Naive Bayes with Laplace smoothing (tiny table)**

Classify an email using two binary features:
- $x_1=$ Offer? (Yes/No)
- $x_2=$ Urgent? (Yes/No)

Training counts (6 emails total):
- Spam (3): Offer=Yes (3), Offer=No (0); Urgent=Yes (2), Urgent=No (1)
- NotSpam (3): Offer=Yes (0), Offer=No (3); Urgent=Yes (1), Urgent=No (2)

We want to classify a new email: Offer=Yes, Urgent=No.

Priors: $P(\text{Spam})=3/6=0.5$, $P(\text{NotSpam})=0.5$.

Without smoothing we get $P(\text{Offer=Yes}\mid \text{NotSpam})=0$ (bad: it kills the score). Apply Laplace smoothing (add 1, for 2 possible values):

For Spam:

$$
P(\text{Offer=Yes}\mid \text{Spam})=\frac{3+1}{3+2}=\frac{4}{5}
$$

$$
P(\text{Urgent=No}\mid \text{Spam})=\frac{1+1}{3+2}=\frac{2}{5}
$$

Score(Spam):

$$
0.5\cdot \frac{4}{5}\cdot \frac{2}{5}=0.5\cdot 0.32=0.16
$$

For NotSpam:

$$
P(\text{Offer=Yes}\mid \text{NotSpam})=\frac{0+1}{3+2}=\frac{1}{5}
$$

$$
P(\text{Urgent=No}\mid \text{NotSpam})=\frac{2+1}{3+2}=\frac{3}{5}
$$

Score(NotSpam):

$$
0.5\cdot \frac{1}{5}\cdot \frac{3}{5}=0.5\cdot 0.12=0.06
$$

**Answer:** Predict Spam (higher score).

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

### Symbol guide & intuition (Module 3)

| Symbol | Read as | Meaning / intuition |
|---|---|---|
| $X$ | random variable | A number produced by a random process |
| $p_X(x)$ | pmf | Probability *at* value $x$ (discrete) |
| $f_X(x)$ | pdf | Density (continuous); probability is area under the curve |
| $F_X(x)$ | cdf | Accumulated probability up to $x$ |
| $\mathbb{E}[X]$ | expectation | Long-run average value |
| $\mathrm{Var}(X)$ | variance | Spread around the mean |
| $\binom{n}{x}$ | "n choose x" | Number of ways to pick $x$ successes out of $n$ |
| $\lambda$ | lambda | Poisson rate (average count per interval) |
| $Z$ | Z-score | Standardized variable: how many SDs from the mean |

**Analogy — pmf vs pdf:**
- Discrete: pmf is like probability "at each bar".
- Continuous: pdf is like a smooth curve; probability is the *area* between two x-values.

**Breakdown — variance identity:**

$$
\mathrm{Var}(X)=\mathbb{E}[X^2]-(\mathbb{E}[X])^2
$$

This is often faster than summing $(x-\mathbb{E}[X])^2$ directly.

### steps(Module 3)

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

### Worked examples (Module 3)

**Example 3A — Poisson probability (pick the right distribution)**

If the number of calls per hour is Poisson with rate $\lambda=3$, find $P(X=0)$.

$$
P(X=0)=e^{-\lambda}\frac{\lambda^0}{0!}=e^{-3}\approx 0.0498
$$

**Example 3B — Normal probability via standardization**

Let $X\sim\mathcal{N}(100, 15^2)$. Find $P(X\le 120)$.

Standardize:

$$
Z=\frac{120-100}{15}=\frac{20}{15}=1.333\ldots
$$

So $P(X\le 120)=P(Z\le 1.33)\approx 0.908$ (from standard normal table/CDF).

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
- Sums of squares :
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
- Bernoulli(p): $\hat{p}=\frac{1}{n}\sum_{i=1}^{n} x_i$
- Poisson(lambda): $\hat{\lambda}_{\mathrm{MLE}}=\bar{x}$
- Normal(mu, sigma^2): $\hat{\mu}=\bar{x}$, $\hat{\sigma}^2=\frac{1}{n}\sum_{i=1}^n (x_i-\bar{x})^2$

### Symbol guide & intuition (Module 4)

| Symbol | Read as | Meaning / intuition |
|---|---|---|
| $H_0$ | "H-zero" | Default assumption (no effect / status quo) |
| $H_1$ | "H-one" | What you want evidence for (effect / difference) |
| $\alpha$ | "alpha" | Significance level: max false-alarm rate you accept |
| p-value | p-value | How surprising your data is *if $H_0$ were true* |
| $z, t$ | test statistics | Standardized distance between sample and $H_0$ |
| $\chi^2$ | chi-square | Measure of mismatch between observed and expected counts |
| df | degrees of freedom | Determines the reference distribution shape |
| $O_{ij}, E_{ij}$ | observed/expected | Counts in the contingency table and what you’d expect under independence |
| SSTR, SSE | sums of squares | Between-groups vs within-groups variation in ANOVA |

**Analogy — hypothesis testing like a court case:**
Treat $H_0$ as "innocent". You only reject $H_0$ if the evidence is strong enough (p-value $<\alpha$).

**Breakdown — z statistic for mean ($\sigma$ known):**

$$
z=\frac{\bar{x}-\mu_0}{\sigma/\sqrt{n}}
$$

- Numerator: how far the sample mean is from the claimed mean
- Denominator: standard error (typical fluctuation of $\bar{x}$)

### steps(Module 4)

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

### Worked examples (Module 4)

**Example 4A — Z-test for a mean (known $\sigma$; exam-style)**

A company claims the *mean time reduction* is $\mu_0=20$ minutes. A test on $n=36$ cases gives $\bar{x}=18.2$ with known $\sigma=7.5$.

Test at $\alpha=0.05$:

- $H_0: \mu=20$
- $H_1: \mu<20$ (evidence that true reduction is *less* than claimed)

Compute:

$$
z=\frac{18.2-20}{7.5/\sqrt{36}}=\frac{-1.8}{1.25}=-1.44
$$

Left-tail p-value $\approx 0.075$.

**Conclusion:** Since $0.075>0.05$, fail to reject $H_0$. Data is not strong enough (at 5%) to conclude the true mean reduction is below 20.

**Example 4B — Chi-square independence (2×2 table)**

Observed counts (rows = Group A/B, columns = Pass/Fail):

$$
O=\begin{bmatrix} 30 & 10 \\\\ 20 & 20 \end{bmatrix}
$$

Row totals: $40,40$; column totals: $50,30$; total $n=80$.

Expected counts under independence:

$$
E=\begin{bmatrix} 25 & 15 \\\\ 25 & 15 \end{bmatrix}
$$

Test statistic:

$$
\chi^2=\sum\frac{(O-E)^2}{E}=\frac{25}{25}+\frac{25}{15}+\frac{25}{25}+\frac{25}{15}=5.33
$$

df $=(2-1)(2-1)=1$. Since $5.33>3.84$ (5% critical), reject independence.

**Conclusion:** There is evidence of association between group and outcome.

**Example 4C — One-way ANOVA (small numbers)**

Three groups (each has 3 observations):
- Group 1: $[5,6,4]$ (mean $=5$)
- Group 2: $[8,9,7]$ (mean $=8$)
- Group 3: $[6,5,7]$ (mean $=6$)

Grand mean: $\bar{x}=57/9=6.333\ldots$

Between-group sum of squares:

$$
\mathrm{SSTR}=3(5-6.333)^2+3(8-6.333)^2+3(6-6.333)^2=14
$$

Within-group sum of squares:

$$
\mathrm{SSE}=2+2+2=6
$$

df: between $=k-1=2$, within $=n-k=6$.

$$
\mathrm{MSTR}=14/2=7,\quad \mathrm{MSE}=6/6=1,\quad F=7
$$

**Conclusion:** Since $F$ is large (e.g., exceeds typical 5% critical value for $(2,6)$), reject $H_0$ (at least one mean differs).

**Bonus (often asked) — Poisson MLE quick application**

Accidents observed over 5 days: $[4,2,5,3,6]$.

$$
\hat{\lambda}=\bar{x}=\frac{4+2+5+3+6}{5}=4
$$

Then $P(X=0)=e^{-4}\approx 0.0183$.

### Simple example (Module 4)
A sample of $n=30$ milk cartons has mean $\bar{x}=505$ ml. Assume population SD $\sigma=10$ ml. Test $H_0:\mu=500$ vs $H_1:\mu\ne 500$ at $\alpha=0.05$.

$$z=\frac{505-500}{10/\sqrt{30}}\approx \frac{5}{1.826}=2.74$$
Two-tailed p-value $\approx 0.006$ (small), so reject $H_0$.

---

## Module 5 — Prediction & Forecasting (Time Series + Regression Basics)

### Covariance and correlation
- Covariance:
  $$\mathrm{Cov}(X,Y)=\mathbb{E}[(X-\mu_X)(Y-\mu_Y)]=\mathbb{E}[XY]-\mathbb{E}[X]\,\mathbb{E}[Y]$$
- Pearson correlation coefficient:

  $$r=\frac{\sum_{i=1}^n (x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum_{i=1}^n (x_i-\bar{x})^2}\,\sqrt{\sum_{i=1}^n (y_i-\bar{y})^2}}$$

  Interpretation: $r\approx 1$ strong positive linear relation, $r\approx -1$ strong negative, $r\approx 0$ no *linear* relation.
- Autocovariance (time series $\{Y_t\}$, lag $h$):
  $$\gamma(h)=\mathrm{Cov}(Y_t,Y_{t+h})$$

### Simple linear regression (one predictor)
Model:
$$Y=a+bX+e$$
Common closed forms:
- Slope:
  $b=\frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sum (x_i-\bar{x})^2}$
- Intercept:
  $a=\bar{y}-b\bar{x}$

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

### Holt’s linear trend method (often used in exams)
Keeps a level $L_t$ and trend $T_t$:

$$
L_t = \alpha Y_t + (1-\alpha)(L_{t-1}+T_{t-1})
$$

$$
T_t = \beta(L_t-L_{t-1}) + (1-\beta)T_{t-1}
$$

Forecast $m$ steps ahead:

$$
F_{t+m}=L_t + mT_t
$$

### Symbol guide & intuition (Module 5)

| Symbol | Read as | Meaning / intuition |
|---|---|---|
| $a,b$ | intercept/slope | Regression line $\hat{y}=a+b x$ |
| $\hat{y}$ | y-hat | Predicted value |
| $\alpha$ | smoothing constant | How much weight the latest observation gets |
| $F_t$ | forecast at time $t$ | Your predicted value for time $t$ |
| $e_t$ | forecast error | Difference between actual and forecast: $Y_t-F_t$ |
| MSE | mean squared error | Average squared error: lower is better |
| $\gamma(h)$ | autocovariance | Measures similarity between values $h$ steps apart |
| $r$ | correlation | Standardized covariance: linear association strength |

**Analogy — exponential smoothing as "memory":**
Small $\alpha$ = long memory (slow to react). Large $\alpha$ = short memory (reacts quickly to spikes).

### steps(Module 5)

**A) Fit a simple linear regression and predict**
1. Compute $\bar{x},\bar{y}$.
2. Compute slope $b$ and intercept $a$.
3. Predict: $\hat{y}=a+b x_\text{new}$.

**B) Exponential smoothing forecast**
1. Pick $\alpha$ (larger $\alpha$ reacts faster to sudden changes).
2. Initialize $F_2=Y_1$.
3. Iterate $F_{t+1}=\alpha Y_t+(1-\alpha)F_t$.
4. Output forecast for next period.

### Worked examples (Module 5)

**Example 5A — Fit a regression line and predict**

Data: $(x,y)\in\{(1,2), (2,3), (3,5)\}$. Fit $\hat{y}=a+bx$ and predict at $x=4$.

Compute means: $\bar{x}=2$, $\bar{y}=(2+3+5)/3=3.333\ldots$

Compute slope:

$$
b=\frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sum (x_i-\bar{x})^2}
=\frac{(-1)(-1.333)+0(-0.333)+(1)(1.667)}{(-1)^2+0^2+1^2}
=\frac{3}{2}=1.5
$$

Intercept:

$$
a=\bar{y}-b\bar{x}=3.333-1.5\cdot 2=0.333\ldots
$$

Predict:

$$
\hat{y}(4)=a+b\cdot 4\approx 0.333+6=6.333
$$

**Answer:** $\hat{y}\approx 0.333+1.5x$, so at $x=4$, $\hat{y}\approx 6.333$.

**Example 5B — Exponential smoothing with two different $\alpha$ (exam-style)**

Series (weeks 1–6): $Y=[112,118,125,121,130,142]$. Use $F_2=Y_1=112$.

For $\alpha=0.4$:

- $F_3=0.4\cdot 118+0.6\cdot 112=114.4$
- $F_4=0.4\cdot 125+0.6\cdot 114.4=118.64$
- $F_5=0.4\cdot 121+0.6\cdot 118.64=119.58$
- $F_6=0.4\cdot 130+0.6\cdot 119.58=123.75$
- $F_7=0.4\cdot 142+0.6\cdot 123.75\approx 131.05$

For $\alpha=0.7$:

- $F_3=0.7\cdot 118+0.3\cdot 112=116.2$
- $F_4=0.7\cdot 125+0.3\cdot 116.2=122.36$
- $F_5=0.7\cdot 121+0.3\cdot 122.36=121.41$
- $F_6=0.7\cdot 130+0.3\cdot 121.41\approx 127.42$
- $F_7=0.7\cdot 142+0.3\cdot 127.42\approx 137.63$

**Conclusion:** Larger $\alpha$ (like 0.7) reacts more to recent spikes (higher, more responsive forecast).

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

### steps(Module 6)

**A) Responsibility for a 2-component 1D GMM**
1. Compute the two Gaussian densities $\mathcal{N}(x\mid\mu_1,\sigma_1^2)$ and $\mathcal{N}(x\mid\mu_2,\sigma_2^2)$.
2. Weight by priors $\pi_1,\pi_2$.
3. Normalize: $\gamma_1=\frac{\pi_1\mathcal{N}_1}{\pi_1\mathcal{N}_1+\pi_2\mathcal{N}_2}$.

**B) One EM iteration (2 components)**
1. E-step: compute $\gamma_{n1},\gamma_{n2}$ for each data point.
2. M-step: compute $N_1,N_2$ then update $\pi_k,\mu_k,(\sigma_k^2\text{ or }\Sigma_k)$.

### Symbol guide & intuition (Module 6)

| Symbol | Read as | Meaning / intuition |
|---|---|---|
| $K$ | number of components | How many clusters/gaussians you mix |
| $\pi_k$ | mixing weight | Prior probability of component $k$ (must sum to 1) |
| $\mathcal{N}(x\mid \mu_k,\Sigma_k)$ | Gaussian density | How likely $x$ is under component $k$ |
| $z$ | latent indicator | Hidden "which cluster" variable |
| $\gamma_{nk}$ | responsibility | Soft assignment: how much component $k$ explains point $n$ |
| $N_k$ | effective count | Total responsibility mass for component $k$ |

**Analogy — soft clustering:**
Instead of assigning each point to exactly one cluster, EM assigns fractions (responsibilities) that add to 1.

### Worked examples (Module 6)

**Example 6A — Responsibility in a 2-component 1D GMM**

Let $\pi_1=0.5,\pi_2=0.5$, $\mu_1=90,\mu_2=100$, $\sigma_1^2=\sigma_2^2=25$.

For $x=95$, the distances are equal, so the Gaussian densities are equal and:

$$
\gamma_1=\frac{0.5}{0.5+0.5}=0.5
$$

**Example 6B — One EM iteration (means update only)**

Data: $x_1=89$, $x_2=102$. Initialize $\pi_1=\pi_2=0.5$, $\mu_1=90$, $\mu_2=100$, $\sigma^2=25$ (same for both).

E-step (using only the exponential parts; common constants cancel):

- For $x_1=89$:

  $$\exp\Big(-\frac{(89-90)^2}{2\cdot 25}\Big)=e^{-0.02}\approx 0.980$$

  $$\exp\Big(-\frac{(89-100)^2}{2\cdot 25}\Big)=e^{-2.42}\approx 0.089$$

  $$\gamma_{11}=\frac{0.980}{0.980+0.089}\approx 0.917$$

- For $x_2=102$:

  $$e^{-2.88}\approx 0.057,\quad e^{-0.08}\approx 0.923$$

  $$\gamma_{21}=\frac{0.057}{0.057+0.923}\approx 0.058$$

Compute effective counts:

$$
N_1=0.917+0.058=0.975,\quad N_2=2-N_1=1.025
$$

Update mixing weights:

$$
\pi_1=\frac{N_1}{2}\approx 0.487,\quad \pi_2\approx 0.513
$$

Update means:

$$
\mu_1=\frac{0.917\cdot 89 + 0.058\cdot 102}{0.975}\approx 89.77
$$

$$
\mu_2=\frac{(1-0.917)\cdot 89 + (1-0.058)\cdot 102}{1.025}\approx 100.95
$$

**Takeaway:** after one iteration, component 1 shifts toward 89 and component 2 shifts toward 102.

### Simple example (Module 6)
Two-component 1D GMM:
- $\pi_1=0.6$, $\pi_2=0.4$
- $\mu_1=90$, $\mu_2=100$
- $\sigma_1^2=\sigma_2^2=25$ (so $\sigma=5$)

For $x=95$, compute $\gamma_1=P(z_1=1\mid x)$.

Because $|95-90|=|95-100|=5$ and variances match, the two Gaussian densities are equal, so
$$\gamma_1=\frac{0.6}{0.6+0.4}=0.6.$$

---

## Extra exam-style worked examples (based on ISM EndSem patterns)

Sources used for patterns: `2024 EndSem Regular ISM.pdf`, `ISM Regular EndSem Feb 2026.pdf`.

Note: Some endsem questions embed the data table as an image; where the table was not extractable, I kept the *same exam pattern* but used a small clean dataset so you still get a complete worked solution.

### Module 5 — Karl Pearson correlation ($r$) (exam-style)

**Question pattern:** Given paired data $(X,Y)$, compute Karl Pearson’s coefficient of correlation and interpret.

**Given (extractable endsem-style data):**

| Student | $X$ (Math) | $Y$ (Stats) |
|---|---:|---:|
| Ram | 12 | 15 |
| Sham | 8 | 10 |
| Rupa | 16 | 18 |
| Anil | 6 | 9 |
| Sunil | 14 | 16 |

**Infer values:** $n=5$, so compute $\bar{x},\bar{y}$ from the 5 pairs.

**Formula used:** $r=\frac{\sum_{i=1}^n (x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum_{i=1}^n (x_i-\bar{x})^2}\,\sqrt{\sum_{i=1}^n (y_i-\bar{y})^2}}$

**Steps:**
1. Compute means:

  $$\bar{x}=\frac{12+8+16+6+14}{5}=11.2,\quad \bar{y}=\frac{15+10+18+9+16}{5}=13.6$$

2. Compute the three needed sums:

  $$\sum (x_i-\bar{x})(y_i-\bar{y})=64.4$$
  $$\sum (x_i-\bar{x})^2=68.8,\quad \sum (y_i-\bar{y})^2=61.2$$

3. Plug in:

  $$r=\frac{64.4}{\sqrt{68.8\cdot 61.2}}\approx 0.9925$$

**Interpretation:** Strong positive linear association (as $X$ increases, $Y$ tends to increase).

---

### Module 5 — Least-squares regression line + prediction (exam-style)

**Question pattern:** Fit a straight line by least squares and predict $Y$ at some $X$.

**Given (extractable endsem-style data):**

- Extraction time (minutes) $X$: $[27,45,41,19,35,39,19,49,15,31]$
- Extraction efficiency (%) $Y$: $[57,64,80,46,62,72,52,77,57,68]$

**Infer values:** $n=10$, simple linear regression $\hat{Y}=a+bX$.

**Formulas used:** $b=\frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sum (x_i-\bar{x})^2},\quad a=\bar{y}-b\bar{x}$

**Steps (results):**
1. Compute $\bar{x},\bar{y}$ (from the 10 pairs).
2. Compute slope and intercept:

  $$b\approx 0.764,\quad a\approx 39.052$$

3. Regression line:

  $$\hat{y}=39.052+0.764x$$

4. Predict efficiency at $x=35$ minutes:

  $$\hat{y}(35)=39.052+0.764\cdot 35\approx 65.792$$

**Answer:** Predicted efficiency at 35 minutes is about $65.8\%$.

---

### Module 5 — Simple Exponential Smoothing (SES) + choose $\alpha$ by MSE (exam-style)

**Question pattern:** Forecast the next period using SES for two values of $\alpha$, then compare by MSE.

**Given (extractable endsem-style data):** Rice export (in thousands of quintals) to USA:

| Year | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 |
|---|---:|---:|---:|---:|---:|---:|---:|
| $Y_t$ | 146 | 159 | 161 | 170 | 174 | 140 | 145 |

Assume initial forecast equals actual: $F_{2015}=Y_{2015}=146$.

**Formula used:**
$$F_{t+1}=\alpha Y_t+(1-\alpha)F_t$$

**Infer values:**
- Forecast for 2022 is $F_{2022}=\alpha Y_{2021}+(1-\alpha)F_{2021}$.
- MSE is computed over years where a real forecast exists (here 2016–2021).

**A) $\alpha=0.3$ (key results)**

Forecasts (2015–2021):
$$[146.000,\ 146.000,\ 149.900,\ 153.230,\ 158.261,\ 162.983,\ 156.088]$$

Forecast for 2022:
$$F_{2022}\approx 152.762$$

MSE (2016–2021):
$$\text{MSE}\approx 245.384$$

**B) $\alpha=0.6$ (key results)**

Forecasts (2015–2021):
$$[146.000,\ 146.000,\ 153.800,\ 158.120,\ 165.248,\ 170.499,\ 152.200]$$

Forecast for 2022:
$$F_{2022}\approx 147.880$$

MSE (2016–2021):
$$\text{MSE}\approx 236.768$$

**Conclusion:** Here $\alpha=0.6$ gives lower MSE (better fit on this history) and is also more responsive to sudden changes.

---

### Module 6 — Holt’s linear trend method (step-by-step) (exam-style)

**Question pattern:** Apply Holt’s method with given $\alpha,\beta,L_0,T_0$ and forecast next month.

**Given (extractable endsem-style data):** subscriptions (in thousands)

| Month | Jan | Feb | Mar | Apr | May | Jun |
|---|---:|---:|---:|---:|---:|---:|
| $Y_t$ | 15 | 18 | 22 | 25 | 29 | 33 |

Parameters: $\alpha=0.5$, $\beta=0.3$, initial level $L_0=15$, initial trend $T_0=3$.

**Formulas used:**
$$L_t = \alpha Y_t + (1-\alpha)(L_{t-1}+T_{t-1})$$
$$T_t = \beta(L_t-L_{t-1}) + (1-\beta)T_{t-1}$$
$$F_{t+1}=L_t+T_t$$

**Infer values:** Since we want July, we need the updated $(L_6,T_6)$ after processing up to June.

**Step-by-step (rounded):**

| $t$ | Month | $Y_t$ | $L_t$ | $T_t$ | Forecast before update ($L_{t-1}+T_{t-1}$) |
|---:|---|---:|---:|---:|---:|
| 1 | Jan | 15.0 | 16.500 | 2.550 | 18.000 |
| 2 | Feb | 18.0 | 18.525 | 2.392 | 19.050 |
| 3 | Mar | 22.0 | 21.459 | 2.555 | 20.917 |
| 4 | Apr | 25.0 | 24.507 | 2.703 | 24.014 |
| 5 | May | 29.0 | 28.105 | 2.971 | 27.210 |
| 6 | Jun | 33.0 | 32.038 | 3.260 | 31.076 |

Forecast for July:
$$F_{\text{July}}=L_6+T_6\approx 32.038+3.260\approx 35.298$$

**Comment (why $\beta$ matters):** $\beta$ controls how quickly your trend estimate adapts; with subscription growth, a fixed trend often lags, so trend smoothing is essential.

---

### Module 4 — One-sample $t$-test (claim about mean reduction) (exam-style)

**Question pattern:** Test a company’s claim about population mean when $\sigma$ is unknown.

**Given (extractable endsem-style data):**

- Claim: mean reduction $\mu_0=15$ mmHg
- Sample: $n=25$, $\bar{x}=13$, $s=5$
- Significance: $\alpha=0.05$

**Infer values:** Unknown population SD $\Rightarrow$ use $t$ test with $df=n-1=24$.

**Hypotheses (two-sided):**
$$H_0:\mu=15\quad \text{vs}\quad H_1:\mu\ne 15$$

**Test statistic:**
$$t=\frac{\bar{x}-\mu_0}{s/\sqrt{n}}=\frac{13-15}{5/\sqrt{25}}=\frac{-2}{1}=-2.0$$

**Decision (p-value approach):**
Two-sided p-value $\approx 0.0569$.

**Conclusion:** Since $p>0.05$, fail to reject $H_0$. At 5% level, the sample does not provide strong enough evidence that the true mean reduction differs from 15 mmHg.

---

### Module 4 — One-sample $z$-test (known $\sigma$) (exam-style)

**Question pattern:** Test a claim about mean when population SD is known.

**Given (extractable endsem-style data):**

- Claim: mean time reduction $\mu_0=20$ minutes
- Sample: $n=36$, $\bar{x}=18.2$, known $\sigma=7.5$
- Significance: $\alpha=0.05$

**Infer values:** Known $\sigma$ and reasonably large $n$ $\Rightarrow$ $z$ test.

**Hypotheses (two-sided):**
$$H_0:\mu=20\quad \text{vs}\quad H_1:\mu\ne 20$$

**Test statistic:**
$$z=\frac{\bar{x}-\mu_0}{\sigma/\sqrt{n}}=\frac{18.2-20}{7.5/\sqrt{36}}=\frac{-1.8}{1.25}=-1.44$$

Two-sided p-value $\approx 0.1499$.

**Conclusion:** Since $p>0.05$, fail to reject $H_0$.

---

### Module 4 — Paired $t$-test (before/after) (exam-style)

**Question pattern:** Same subjects measured twice; test if the intervention improves the mean.

**Given (endsem-style; the exam often provides a small table):**

| Student | Before | After |
|---|---:|---:|
| 1 | 56 | 58 |
| 2 | 48 | 50 |
| 3 | 50 | 54 |
| 4 | 52 | 55 |
| 5 | 49 | 51 |
| 6 | 55 | 56 |

Define paired differences $d_i = \text{After}-\text{Before}$.

**Infer values:** $n=6$ pairs, unknown SD of differences $\Rightarrow$ paired $t$ test with $df=5$.

**Hypotheses (one-sided improvement):**
$$H_0:\mu_d=0\quad \text{vs}\quad H_1:\mu_d>0$$

**Formulas used:**
$$\bar{d}=\frac{1}{n}\sum d_i,\quad s_d^2=\frac{1}{n-1}\sum(d_i-\bar{d})^2,\quad t=\frac{\bar{d}}{s_d/\sqrt{n}}$$

**Steps:**
1. Differences: $d=[2,2,4,3,2,1]$.
2. Mean difference:

  $$\bar{d}=\frac{2+2+4+3+2+1}{6}=\frac{14}{6}\approx 2.333$$

3. Sample SD of differences:

  $$s_d\approx 1.033$$

4. Test statistic:

  $$t=\frac{2.333}{1.033/\sqrt{6}}\approx 5.53$$

**Conclusion:** Very strong evidence for improvement (large positive $t$).

---

### Module 4 — $F$-test for comparing variances (exam-style)

**Question pattern:** Two methods, compare variability (variances) using an $F$ test.

**Given (extractable endsem-style data):**

- Method A: $n_A=10$, sample SD $s_A=0.032$
- Method B: $n_B=14$, sample SD $s_B=0.028$
- Test at 5% significance whether A has *greater* variability.

**Infer values:** Right-tailed test on the variance ratio with degrees of freedom $df_1=n_A-1=9$, $df_2=n_B-1=13$.

**Hypotheses (right-tail):**
$$H_0:\sigma_A^2=\sigma_B^2\quad \text{vs}\quad H_1:\sigma_A^2>\sigma_B^2$$

**Test statistic:**
$$F=\frac{s_A^2}{s_B^2}=\frac{0.032^2}{0.028^2}\approx 1.306$$

Critical value at 5% (right tail):
$$F_{0.95}(9,13)\approx 2.714$$

**Conclusion:** Since $1.306<2.714$ (p-value $\approx 0.321$), fail to reject $H_0$. Not enough evidence that Method A is more variable.

---

### Module 4 — Poisson MLE + probability of zero (exam-style)

**Question pattern:** For Poisson data, find MLE of $\lambda$ and compute $P(X=0)$.

**Given (extractable endsem-style data):** accidents over 5 days: $[4,2,5,3,6]$.

**Infer values:** For Poisson($\lambda$), MLE is sample mean.

**Formulas used:**
$$\hat{\lambda}=\bar{x}$$
$$P(X=0)=e^{-\lambda}$$

**Steps:**
1. MLE:

  $$\hat{\lambda}=\frac{4+2+5+3+6}{5}=4$$

2. Probability of no accidents:

  $$P(X=0)\approx e^{-4}\approx 0.0183$$

---

### Module 4 — CI for mean + “white noise” residual check (exam-style)

**Question pattern A:** Construct a 95% CI for the population mean when $\sigma$ is unknown and $n$ is small.

**Given (typical endsem setup):** $n=20$ and the full sample is provided. Compute $\bar{x}$ and $s$ from the 20 numbers.

**Formula used (95% CI):**
$$\bar{x}\pm t_{0.975,\,n-1}\frac{s}{\sqrt{n}}$$

For $n=20$, $df=19$ and typically $t_{0.975,19}\approx 2.093$.

**Question pattern B:** Given residual series, compute sample mean/variance and comment on white noise.

**Given (extractable endsem-style data):** residuals
$$\{2,-1,0,1,-2,1,-1,0\}$$

**Infer values:** $n=8$. White noise is commonly assessed by (i) mean near 0 and (ii) no significant autocorrelation (often a qualitative check unless ACF/Ljung-Box is asked).

**Steps:**
1. Sample mean:

  $$\bar{r}=\frac{2-1+0+1-2+1-1+0}{8}=0$$

2. Sample variance (unbiased):

  $$s^2=\frac{1}{n-1}\sum (r_i-\bar{r})^2=\frac{1}{7}(4+1+0+1+4+1+1+0)=\frac{12}{7}\approx 1.714$$

**Comment:** Mean is exactly 0 here and variance is finite; with only 8 points you typically *cannot* prove white noise, but these are consistent with a “noise-like” residual series. If the exam asks for a formal check, compute ACF and/or Ljung–Box.
