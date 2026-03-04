# MFML (Combined PDF) — Module-wise Formulas + How to Solve

Source: `MFML_Combined4_boxed.pdf` (139 pages).

Note: A few slides in this PDF are image-heavy; when a formula wasn’t extractable as text, I reconstructed it from the surrounding example/standard definition used in the same module (e.g., Gram–Schmidt steps, SVD definition). If you want, tell me a page number where something looks off and I’ll re-check that section.

---

## Module 1 — Matrices & Solving Systems of Linear Equations

### Core representations
- Linear system (resource-form example):
  $$a_{1i}x_1 + a_{2i}x_2 + \cdots + a_{ni}x_n = b_i$$
- Matrix form:
  $$A x = b$$
- Augmented matrix:
  $$[A\mid b]$$

### Row-echelon / reduced row-echelon (RREF)
A matrix is in **row echelon form** if:
1. All nonzero rows are above all-zero rows
2. Each leading entry (pivot) is to the right of the pivot in the row above
3. Entries below each pivot are zero

It is in **RREF** if additionally:
4. Each pivot is 1
5. Each pivot is the only nonzero entry in its column

### Elementary row operations (do **not** change solution set)
1. Swap two rows
2. Multiply a row by nonzero scalar $c$
3. Replace $R_j \leftarrow R_j + a R_i$

### Gaussian elimination (upper-triangular) vs Gauss–Jordan (RREF)
- Gaussian elimination: reduce $[A\mid b]$ to echelon form, then back-substitute.
- Gauss–Jordan: reduce all the way to RREF.

### Invertibility (square $n\times n$)
- $A$ invertible $\Leftrightarrow A^{-1}$ exists and
  $$AA^{-1} = A^{-1}A = I_n$$
- If $A$ is invertible, the RREF of $A$ is $I_n$.

### Computing inverse via Gauss–Jordan
Set up
$$[A\mid I] \xrightarrow{\text{row ops}} [I\mid A^{-1}]$$
If you cannot reduce the left block to $I$, then $A^{-1}$ does not exist.

### Rank, row space, column space
- Row space: span of rows in $\mathbb{R}^n$
- Column space: span of columns in $\mathbb{R}^m$
- **Rank**:
  $$\mathrm{rank}(A) = \dim(\text{row space}) = \dim(\text{col space})$$
- If $A$ is in echelon form, the **nonzero rows** form a basis of row space; rank = number of nonzero rows.

### Determinant (key properties from slides)
Elementary operations:
1. Swap rows: $\det$ changes sign
2. Multiply a row by $c$: $\det$ multiplies by $c$
3. Add multiple of a row to another: $\det$ unchanged

Echelon-form determinant definition used in slides:
- Let $U$ be an echelon form of $A$ using row ops (typically swaps + row additions). If $r$ swaps were used, then
  $$\det(A) = (-1)^r \prod_{i=1}^n u_{ii}$$

### How to solve typical questions (Module 1)

**A) Solve a linear system $Ax=b$**
1. Write augmented matrix $[A\mid b]$.
2. Use elementary row operations to reach echelon form.
3. Identify pivots; check for inconsistency (a row like $[0\ 0\ \cdots\ 0\mid 1]$ means no solution).
4. Back-substitute to get solution(s).
5. If free variables exist → infinitely many solutions; parametrize.

**B) Solve homogeneous system $Ax=0$**
1. Row-reduce $A$ to echelon form.
2. If every column has a pivot (rank $=n$) → only trivial solution $x=0$.
3. Otherwise choose free variables and parametrize the null space.

**C) Find $A^{-1}$**
1. Form $[A\mid I]$.
2. Row-reduce to $[I\mid *]$.
3. The right block is $A^{-1}$.

**D) Find rank($A$)**
1. Row-reduce $A$ to echelon form (RREF not required).
2. Count nonzero rows (equivalently, pivot columns).

---

## Module 2 — Vectors, Distance/Angle, Linear (In)dependence

### Vector space basics (as used in slides)
- Closure under vector addition and scalar multiplication.
- Subspace test (common): show $0\in U$, closed under $x+y$ and $\alpha x$.
- Null space: solution set of $Ax=0$ is a subspace of $\mathbb{R}^n$.

### Linear combination
For $x_1,\dots,x_k\in V$, a vector $v$ is a linear combination if
$$v = \alpha_1 x_1 + \cdots + \alpha_k x_k.$$

To find coefficients, set up a system by equating coordinates and solve via Gaussian elimination.

### Span
$$\mathrm{span}\{v_1,\dots,v_k\} = \{\text{all linear combinations of } v_i\}.$$

### Linear dependence / independence
Vectors $x_1,\dots,x_k$ are **dependent** if there exists a non-trivial solution to
$$\alpha_1 x_1 + \cdots + \alpha_k x_k = 0.$$
Otherwise independent.

Practical check (slides): put vectors as columns of $A$ and solve $A\alpha=0$.
- If only trivial solution → independent.
- Free variable(s) → dependent.

Quick rule from slides: $n$ vectors in $\mathbb{R}^m$ with $n>m$ are dependent.

### Basis and dimension
- A basis: linearly independent set that spans the space.
- Dimension: number of vectors in a basis.

### Dot product / inner product
Dot product in $\mathbb{R}^n$:
$$x\cdot y = x^T y = \sum_{i=1}^n x_i y_i.$$

General inner product (slides): If $A$ is symmetric positive definite (SPD),
$$\langle x,y\rangle_A = x^T A y.$$

SPD definition:
- $A^T=A$
- $x^T A x > 0$ for all $x\neq 0$

### Norms (slides)
A norm $\|\cdot\|$ satisfies:
- Absolute homogeneity: $\|\alpha x\|=|\alpha|\,\|x\|$
- Triangle inequality: $\|x+y\|\le \|x\|+\|y\|$
- Positive definite: $\|x\|\ge 0$ and $\|x\|=0\Leftrightarrow x=0$

Common norms shown:
- Manhattan (L1): $\|x\|_1 = \sum_i |x_i|$
- Euclidean (L2): $\|x\|_2 = \sqrt{\sum_i x_i^2}$

Norm induced by inner product:
$$\|x\| = \sqrt{\langle x,x\rangle}.$$
So for $\langle\cdot,\cdot\rangle_A$:
$$\|x\|_A = \sqrt{x^T A x}.$$

### Cauchy–Schwarz (as derived)
$$|\langle u,v\rangle| \le \|u\|\,\|v\|.$$

### Distance (metric) induced by norm
$$d(x,y) = \|x-y\|.$$
With Euclidean norm: $d(x,y)=\|x-y\|_2$.

### Angle between vectors (slides)
For nonzero $x,y$:
$$\cos(\theta)=\frac{\langle x,y\rangle}{\|x\|\,\|y\|},\quad \theta\in[0,\pi].$$
With dot product, this is standard Euclidean angle.

### Orthogonality
$$x\perp y \iff \langle x,y\rangle = 0.$$
Depends on choice of inner product.

### Orthogonal matrix (slides)
A square matrix $A$ is orthogonal if
$$A^T A = I = A A^T,\quad A^{-1}=A^T.$$
Length preservation:
$$\|Ax\|_2^2 = (Ax)^T(Ax)=x^T A^T A x = x^T x = \|x\|_2^2.$$
Angle preservation (Euclidean):
$$\frac{(Ax)^T(Ay)}{\|Ax\|\,\|Ay\|} = \frac{x^T y}{\|x\|\,\|y\|}.$$

### Gram–Schmidt orthonormalization (reconstructed; slide text was mostly images)
Given independent $x_1,\dots,x_n$:
- $u_1=x_1$, $e_1=u_1/\|u_1\|$
- For $k\ge 2$:
  $$u_k = x_k - \sum_{j=1}^{k-1} \mathrm{proj}_{e_j}(x_k),\quad \mathrm{proj}_{e_j}(x)=\langle x,e_j\rangle e_j$$
  $$e_k = \frac{u_k}{\|u_k\|}$$

### How to solve typical questions (Module 2)

**A) Check linear independence**
1. Put the given vectors as columns in a matrix $A$.
2. Solve $A\alpha=0$ by row-reduction.
3. Only trivial solution → independent; else dependent.

**B) Find basis for a span**
1. Put spanning vectors as columns of $A$.
2. Row-reduce $A$.
3. Original columns corresponding to pivot columns form a basis.

**C) Compute angle / distance**
1. Choose inner product (dot product unless a matrix-$A$ inner product is specified).
2. Compute $\langle x,y\rangle$, $\|x\|$, $\|y\|$.
3. Use $\cos\theta = \langle x,y\rangle/(\|x\|\|y\|)$.
4. Distance: $d(x,y)=\|x-y\|$.

---

## Module 3 — Matrix Decompositions (Eigen, Spectral, Cholesky, SVD)

### Eigenvalues / eigenvectors
- Eigen equation:
  $$A x = \lambda x,\quad x\neq 0$$
- Characteristic equation:
  $$\det(A-\lambda I)=0$$
- Eigenspace:
  $$E_\lambda = \{x: (A-\lambda I)x=0\} = \mathcal{N}(A-\lambda I)$$

Triangular matrix fact from slides:
- Eigenvalues of a triangular matrix are its diagonal entries.

### Spectral theorem (symmetric matrices)
If $A\in\mathbb{R}^{n\times n}$ is symmetric, it has an orthonormal eigenbasis and real eigenvalues. Decomposition:
$$A = Q\Lambda Q^T$$
where columns of $Q$ are orthonormal eigenvectors and $\Lambda$ is diagonal of eigenvalues.

Also used in ML context: $A^T A$ and $A A^T$ are symmetric; appear in SVD and PCA.

### Cholesky decomposition (SPD matrices)
If $A$ is symmetric positive definite, then
$$A = L L^T$$
with $L$ lower-triangular with positive diagonal.

Determinant via Cholesky (slides):
$$\det(A)=\det(L)\det(L^T)=\det(L)^2=(\prod_i L_{ii})^2.$$

### Singular Value Decomposition (SVD) (standard; slide section focuses on applications)
For any $A\in\mathbb{R}^{m\times n}$:
$$A = U\Sigma V^T$$
- $U\in\mathbb{R}^{m\times m}$ orthogonal
- $V\in\mathbb{R}^{n\times n}$ orthogonal
- $\Sigma$ diagonal (rectangular) with singular values $\sigma_1\ge\sigma_2\ge\cdots\ge 0$

Truncated SVD / rank-$k$ approximation:
$$A_k = U_k\Sigma_k V_k^T$$
(keep top $k$ singular values).

### How to solve typical questions (Module 3)

**A) Find eigenvalues/eigenvectors**
1. Compute $\det(A-\lambda I)$.
2. Solve $\det(A-\lambda I)=0$ for $\lambda$.
3. For each $\lambda$, solve $(A-\lambda I)x=0$ for eigenvectors (a basis).

**B) Diagonalize (when possible)**
1. Find $n$ linearly independent eigenvectors.
2. Form $Q=[v_1\ \cdots\ v_n]$ and $\Lambda=\mathrm{diag}(\lambda_i)$.
3. Verify $A=Q\Lambda Q^{-1}$.
For symmetric $A$, choose orthonormal eigenvectors so $Q^{-1}=Q^T$.

**C) Cholesky factorization**
1. Verify $A$ is symmetric.
2. Verify positive definiteness (often via Sylvester’s criterion: leading principal minors $>0$).
3. Solve for $L$ in $A=LL^T$ entry-by-entry (as in the 2×2 example in slides).

**D) Low-rank approximation via truncated SVD**
1. Compute SVD $A=U\Sigma V^T$.
2. Choose $k$.
3. Keep top $k$ components → $A_k$.

---

## Module 4 — Vector Calculus (Derivatives, Gradients, Taylor, Hessian, Backprop)

### Taylor’s theorem (1D, with remainder) (as shown)
If $f$ is $n$-times differentiable, then for some $c\in(a,b)$:
$$f(b)=\sum_{k=0}^{n-1}\frac{f^{(k)}(a)}{k!}(b-a)^k + \frac{f^{(n)}(c)}{n!}(b-a)^n.$$

Mean Value Theorem (special case $n=1$):
$$f'(c)=\frac{f(b)-f(a)}{b-a}.$$

### Taylor in two variables (2nd order form shown)
Let $h,k$ be small increments:
$$f(a+h,b+k)=f(a,b)+h f_x(a,b)+k f_y(a,b)+\frac{1}{2}\left(h^2 f_{xx}+2hk f_{xy}+k^2 f_{yy}\right)\big|_{(a+ch,b+ck)}$$
for some $c\in(0,1)$.

### Hessian (2 variables)
$$H_f(x,y)=\begin{bmatrix}f_{xx} & f_{xy}\\ f_{yx} & f_{yy}\end{bmatrix}$$
(For smooth $f$, $f_{xy}=f_{yx}$ so Hessian is symmetric.)

### 2D second-derivative test / discriminant (slides)
At a critical point $(a,b)$ where $f_x=f_y=0$, define
$$D = f_{xx}(a,b)f_{yy}(a,b) - (f_{xy}(a,b))^2.$$
- If $D>0$ and $f_{xx}>0$ → local minimum
- If $D>0$ and $f_{xx}<0$ → local maximum
- If $D<0$ → saddle

Sylvester criterion perspective (slides): Hessian positive definite iff leading principal minors $>0$.

### Linearization (first-order approximation)
$$f(x) \approx f(x_0) + \nabla f(x_0)^T (x-x_0).$$

### Backprop / automatic differentiation (as shown)
Neural layer form:
$$f_i = \phi_i(A_{i-1}f_{i-1}+b_{i-1}),\quad i=1,\dots,K,$$
Loss (example):
$$L(\theta)=\|y-f_K(\theta,x)\|_2^2.$$
Chain rule reuse idea:
Compute partials from output backwards so intermediate derivatives can be reused.

### How to solve typical questions (Module 4)

**A) Find local maxima/minima of $f(x,y)$**
1. Compute $f_x, f_y$.
2. Solve $f_x=0, f_y=0$ for critical points.
3. Compute $f_{xx},f_{yy},f_{xy}$ and discriminant $D$ at each point.
4. Classify using the test above.
5. For absolute extrema on a closed region: also check boundaries (reduce to 1D along edges).

**B) Build Taylor approximation**
1. Pick expansion point (e.g., $a$ or $(a,b)$).
2. Compute derivatives up to desired order.
3. Plug into Taylor polynomial; keep remainder form if required.

**C) Do backprop on a composite function**
1. Break computation into named intermediates (nodes) like $a,b,c,\dots$.
2. Compute local derivatives at each node.
3. Propagate gradients backward using chain rule.

---

## Module 5 — Gradient Descent & Optimization Challenges

### Objective minimization
Unconstrained problem:
$$\min_x f(x)$$

### Gradient descent update (slides)
$$x_{i+1} = x_i - \alpha\, \nabla f(x_i)$$
where $\alpha$ is step size / learning rate.

### Separability (SGD motivation)
If
$$L(\theta) = \sum_{i=1}^n L_i(\theta),$$
then gradient can be approximated by sampling terms (SGD / mini-batch).

### Feature scaling (slides)
- Mean centering: subtract column means
- Normalization: divide by column standard deviation
- Min–max scaling (as shown):
  $$x_{ij} \leftarrow \frac{x_{ij}-\min_j}{\max_j-\min_j}$$

### Momentum (slides)
$$x_{i+1}=x_i - \alpha\nabla f(x_i) + v_i$$
$$v_i = \mu (x_i-x_{i-1}),\quad v_0=0,\quad \mu\in[0,1]$$

### Constrained optimization (inequalities + equalities)
Primal:
$$\min_x f(x)\ \text{s.t. } g_i(x)\le 0,\ i\in[m],\ \ h_j(x)=0,\ j\in[p]$$

Lagrangian (slides):
$$L(x,\lambda,\nu)=f(x)+\sum_{i=1}^m \lambda_i g_i(x)+\sum_{j=1}^p \nu_j h_j(x),\quad \lambda_i\ge 0.$$

### KKT conditions (slides)
At optimum $(x^*,\lambda^*,\nu^*)$:
1. Primal feasibility: $g_i(x^*)\le0$, $h_j(x^*)=0$
2. Dual feasibility: $\lambda_i^*\ge0$
3. Complementary slackness: $\lambda_i^* g_i(x^*)=0$
4. Stationarity:
   $$\nabla f(x^*) + \sum_i \lambda_i^* \nabla g_i(x^*) + \sum_j \nu_j^* \nabla h_j(x^*)=0$$

### Convexity criterion (slides)
Convex set: $x,y\in C\Rightarrow \theta x+(1-\theta)y\in C$.

Convex function:
$$f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y).$$
Gradient (first-order) condition:
$$f(y)\ge f(x)+\nabla f(x)^T(y-x).$$

### How to solve typical questions (Module 5)

**A) Run gradient descent**
1. Compute gradient $\nabla f$.
2. Choose $\alpha$ (small) and initialization $x_0$.
3. Iterate $x_{k+1}=x_k-\alpha\nabla f(x_k)$ until convergence.
4. Stop when $|f(x_{k+1})-f(x_k)|$ is small or $\|\nabla f(x_k)\|$ is small.

**B) Form a constrained optimization using Lagrange multipliers**
1. Write constraints as $g_i(x)\le0$ and $h_j(x)=0$.
2. Write Lagrangian $L(x,\lambda,\nu)$.
3. Apply KKT (or for equality-only constraints: solve $\nabla f=\lambda\nabla g$ + constraint).

---

## Module 6 — Optimization in ML (PCA, SVM)

### PCA setup (slides)
Data: $x_n\in\mathbb{R}^D$, centered so $\mathbb{E}[x]=0$.

Covariance:
$$S = \frac{1}{N}\sum_{n=1}^N x_n x_n^T.$$

Projection matrix $B=[b_1,\dots,b_M]\in\mathbb{R}^{D\times M}$ with orthonormal columns:
$$b_i^T b_j = 0\ (i\ne j),\quad b_i^T b_i=1.$$

Low-dim code and reconstruction (slides):
$$z = B^T x,\quad \hat x = B z = BB^T x.$$

### PCA as maximum-variance direction (slides)
Variance along $b_1$:
$$V_1 = b_1^T S b_1.$$
Optimization:
$$\max_{b_1} b_1^T S b_1 \ \text{s.t. } \|b_1\|_2=1.$$
Lagrangian leads to eigenproblem:
$$S b_1 = \lambda b_1.$$
So $b_1$ is eigenvector of $S$ with largest eigenvalue.

### SVM: linear classifier geometry
Hyperplane:
$$w^T x + b = 0.$$
$w$ is normal to the separating hyperplane.

### Hard-margin SVM (slides)
$$\min_{w,b} \frac{1}{2}\|w\|_2^2\ \text{s.t. } y_n(w^T x_n + b)\ge 1,\ \forall n.$$

### Soft-margin SVM (slides)
Introduce slack variables $\xi_n\ge 0$:
$$\min_{w,b,\xi} \frac{1}{2}\|w\|_2^2 + C\sum_{n=1}^N \xi_n$$
subject to
$$y_n(w^T x_n + b)\ge 1-\xi_n,\quad \xi_n\ge 0.$$

### Hinge loss (slides)
For a point $(x_n,y_n)$:
$$\ell_n = \max\big(0,\ 1 - y_n(w^T x_n + b)\big).$$
Soft-margin objective (common equivalent form shown in examples):
$$\min_{w,b}\ \frac{1}{2}\|w\|_2^2 + C\sum_{n=1}^N \max(0, 1-y_n(w^T x_n + b)).$$

### Kernels (slides)
Kernel is an inner product in feature space:
$$K(x_i,x_j)=\phi(x_i)^T\phi(x_j).$$
Examples shown:
- Linear: $K(x_i,x_j)=x_i^T x_j$
- Polynomial degree $p$: $K(x_i,x_j)=(1+x_i^T x_j)^p$
- Sigmoid: $K(x_i,x_j)=\tanh(\alpha_0 x_i^T x_j + \alpha_1)$

### KKT + duality (appears in SVM prelim slides)
KKT conditions listed in Module 5 apply; strong duality under Slater’s condition (convex + strict feasibility).

### How to solve typical questions (Module 6)

**A) Do PCA on a dataset (conceptual + computation-ready)**
1. Center data: $x_n \leftarrow x_n-\mu$.
2. Compute covariance $S$.
3. Compute eigenpairs $(\lambda_i,b_i)$ of $S$.
4. Sort by eigenvalue descending.
5. Choose top $M$ eigenvectors → $B$.
6. Project: $z_n=B^T x_n$.
7. Reconstruct (if asked): $\hat x_n = B z_n$.

**B) Formulate a soft-margin linear SVM optimization problem**
1. Assign labels $y_n\in\{-1,+1\}$.
2. Write hyperplane $w^T x + b=0$.
3. Write objective $\frac12\|w\|^2 + C\sum \xi_n$.
4. Write constraints $y_n(w^T x_n+b)\ge 1-\xi_n$ and $\xi_n\ge 0$.

**C) Compute hinge-loss objective for a proposed $(w,b)$ (as in examples)**
1. For each point compute score $s_n = w^T x_n+b$.
2. Compute margin quantity $m_n=y_n s_n$.
3. Hinge loss $\ell_n=\max(0,1-m_n)$.
4. Total objective $\frac12\|w\|^2 + C\sum_n \ell_n$.

**D) Nonlinear SVM with kernels (high-level steps from slides)**
1. Pick a kernel $K$.
2. Compute kernel matrix $K_{ij}=K(x_i,x_j)$.
3. Solve dual for $\alpha$ (support vectors).
4. Classify new $x$ via sign of weighted kernel sum.

---

## If you want this as a printable formula sheet
Tell me if you prefer:
- a shorter 2–3 page “exam crib” version, or
- a longer version with worked mini-examples per module.
