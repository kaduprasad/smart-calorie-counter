
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

### Determinant
Elementary operations:
1. Swap rows: $\det$ changes sign
2. Multiply a row by $c$: $\det$ multiplies by $c$
3. Add multiple of a row to another: $\det$ unchanged

Echelon-form determinant definition used in slides:
- Let $U$ be an echelon form of $A$ using row ops (typically swaps + row additions).
- If $r$ swaps were used, then
  - $$\det(A) = (-1)^r \prod_{i=1}^n u_{ii}$$

### question(Module 1)

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

### Worked examples (Module 1)

**Example 1A — Solve $Ax=b$**

Solve:

$$
x_1 + 2x_2 = 5
$$

$$
3x_1 + 4x_2 = 11
$$

Step 1 — Augmented matrix:

$$
\left[\begin{array}{cc|c} 1 & 2 & 5 \\\\ 3 & 4 & 11 \end{array}\right]
$$

Step 2 — $R_2 \leftarrow R_2 - 3R_1$:

$$
\left[\begin{array}{cc|c} 1 & 2 & 5 \\\\ 0 & -2 & -4 \end{array}\right]
$$

Step 3 — Back-substitute: $-2x_2=-4 \implies x_2=2$. Then $x_1+4=5 \implies x_1=1$.

**Answer:** $x_1=1,\ x_2=2$.

**Example 1B — Find $A^{-1}$**

$$
A = \begin{bmatrix} 1 & 2 \\\\ 3 & 4 \end{bmatrix}
$$

Form $[A \mid I]$:

$$
\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 3 & 4 & 0 & 1 \end{array}\right]
$$

$R_2 \leftarrow R_2-3R_1$:

$$
\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 0 & -2 & -3 & 1 \end{array}\right]
$$

$R_2 \leftarrow R_2/(-2)$:

$$
\left[\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 0 & 1 & 3/2 & -1/2 \end{array}\right]
$$

$R_1 \leftarrow R_1 - 2R_2$:

$$
\left[\begin{array}{cc|cc} 1 & 0 & -2 & 1 \\\\ 0 & 1 & 3/2 & -1/2 \end{array}\right]
$$

$$
A^{-1} = \begin{bmatrix} -2 & 1 \\\\ 3/2 & -1/2 \end{bmatrix}
$$

**Example 1C — Find rank and determinant**

Same $A$ above. It row-reduces to 2 nonzero rows, so $\mathrm{rank}(A)=2$.

$\det(A) = 1{\cdot}4 - 2{\cdot}3 = -2$. (Non-zero, confirming $A$ is invertible.)

---

## Module 2 — Vectors, Distance/Angle, Linear (In)dependence

### Vector space basics
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

### Angle between vectors
For nonzero $x,y$:
$$\cos(\theta)=\frac{\langle x,y\rangle}{\|x\|\,\|y\|},\quad \theta\in[0,\pi].$$
With dot product, this is standard Euclidean angle.

### Orthogonality
$$x\perp y \iff \langle x,y\rangle = 0.$$
Depends on choice of inner product.

### Orthogonal matrix
A square matrix $A$ is orthogonal if
- $$A^T A = I = A A^T,\quad A^{-1}=A^T.$$

- Length preservation:
  - $$\|Ax\|_2^2 = (Ax)^T(Ax)=x^T A^T A x = x^T x = \|x\|_2^2.$$
- Angle preservation (Euclidean):
  - $$\frac{(Ax)^T(Ay)}{\|Ax\|\,\|Ay\|} = \frac{x^T y}{\|x\|\,\|y\|}.$$

### Gram–Schmidt orthonormalization
Given linearly independent $x_1,\dots,x_n$ (standard inner product unless stated otherwise):

$$
u_1 = x_1,\quad e_1 = \frac{u_1}{\|u_1\|}.
$$

For $k\ge 2$:

$$
u_k = x_k - \sum_{j=1}^{k-1} \mathrm{proj}_{e_j}(x_k),\quad e_k = \frac{u_k}{\|u_k\|}.
$$

Projection (two equivalent “quick-use” forms):

1) If $e_j$ are unit vectors (as they are in Gram–Schmidt),
$$\mathrm{proj}_{e_j}(x) = \langle x,e_j\rangle\, e_j.$$

2) General projection onto a non-unit vector $u$:
$$\mathrm{proj}_{u}(x) = \frac{\langle x,u\rangle}{\langle u,u\rangle}\,u.$$

Simple dot-product form (common in problems):
$$u_k = x_k - \sum_{j=1}^{k-1} (x_k^T e_j)\,e_j,\quad e_k = \frac{u_k}{\|u_k\|}.$$

### Symbol guide & simple examples (Module 2)

| Symbol | Read as | What it means |
|---|---|---|
| $\mathbb{R}^n$ | "R-n" | The set of all lists of $n$ real numbers, e.g. $\mathbb{R}^3$ = all 3D points like $(1,2,3)$ |
| $\alpha, \beta$ | "alpha, beta" | Scalar (plain number) multipliers |
| $x^T$ | "x transpose" | Flip a column vector into a row (or vice-versa) |
| $\sum_{i=1}^{n}$ | "sum from i=1 to n" | Add up terms: $\sum_{i=1}^{3} x_i = x_1+x_2+x_3$ |
| $x \cdot y$ or $x^T y$ | "x dot y" | Multiply matching entries and add: $(1,2,3)\cdot(4,5,6)=1{\cdot}4+2{\cdot}5+3{\cdot}6=32$ |
| $\langle x,y\rangle$ | "inner product of x and y" | A generalized dot product; with the plain dot product $\langle x,y\rangle = x^T y$ |
| $\|x\|$ | "norm of x" | Length/magnitude of vector $x$ |
| $\|x\|_2$ | "L2 norm of x" | Euclidean length: $\|(3,4)\|_2 = \sqrt{9+16}=5$ |
| $\|x\|_1$ | "L1 norm of x" | Manhattan distance from origin: $\|(3,-4)\|_1 = 3+4 = 7$ |
| $\perp$ | "perpendicular to" | Two vectors are at 90 degrees; their dot product is 0 |
| $\cos\theta$ | "cosine of theta" | Ratio that tells you the angle between two vectors |
| $\mathrm{span}\{\dots\}$ | "span of ..." | All vectors you can build by scaling and adding the given vectors |
| $\mathrm{proj}_u(x)$ | "projection of x onto u" | The shadow of $x$ onto the line of $u$ |

**Simple example — Dot product, norm, angle:**

Let $x=(1,0)$ and $y=(1,1)$.

$$
x \cdot y = 1{\cdot}1 + 0{\cdot}1 = 1
$$

$$
\|x\| = \sqrt{1^2+0^2} = 1,\quad \|y\| = \sqrt{1^2+1^2} = \sqrt{2}
$$

$$
\cos\theta = \frac{1}{1 \cdot \sqrt{2}} = \frac{1}{\sqrt{2}} \implies \theta = 45^\circ
$$

**Simple example — Projection:**

Project $y=(1,1)$ onto $x=(1,0)$:

$$
\mathrm{proj}_x(y) = \frac{y \cdot x}{x \cdot x}\,x = \frac{1}{1}\,(1,0) = (1,0)
$$

The "shadow" of $(1,1)$ onto the x-axis is $(1,0)$.

**Simple example — Linear dependence:**

Vectors $v_1=(1,2)$ and $v_2=(2,4)$ are **dependent** because $v_2 = 2 v_1$ (one is a scaled copy of the other — they lie on the same line).

Vectors $v_1=(1,0)$ and $v_2=(0,1)$ are **independent** because neither is a multiple of the other — they point in genuinely different directions.

### question(Module 2)

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

### Worked examples (Module 2)

**Example 2A — Check linear independence**

Are $v_1=(1,2,3)$ and $v_2=(2,4,6)$ linearly independent?

Put as columns and solve $A\alpha=0$:

$$
\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\\\ 3 & 6 \end{bmatrix} \begin{bmatrix} \alpha_1 \\\\ \alpha_2 \end{bmatrix} = \begin{bmatrix} 0 \\\\ 0 \\\\ 0 \end{bmatrix}
$$

Row-reduce: $R_2 \leftarrow R_2-2R_1$, $R_3 \leftarrow R_3-3R_1$:

$$
\begin{bmatrix} 1 & 2 \\\\ 0 & 0 \\\\ 0 & 0 \end{bmatrix}
$$

$\alpha_2$ is free → non-trivial solution exists (e.g. $\alpha_1=-2, \alpha_2=1$).

**Answer:** Dependent (indeed $v_2=2v_1$).

**Example 2B — Find basis for a span**

**What the question is asking:**
Given vectors $v_1=(1,0,1)$, $v_2=(2,0,2)$, $v_3=(0,1,1)$, find the smallest subset that spans the same space — i.e., remove any redundant vectors so the remaining ones are linearly independent but still generate every vector the original set could.

**Step 1 — Put each vector as a column of a matrix:**

Each $v_i$ becomes one column. This gives us a $3 \times 3$ matrix:

$$
A = \begin{bmatrix} 1 & 2 & 0 \\\\ 0 & 0 & 1 \\\\ 1 & 2 & 1 \end{bmatrix} \quad \leftarrow \text{col 1 = } v_1,\ \text{col 2 = } v_2,\ \text{col 3 = } v_3
$$

**Step 2 — Row-reduce to echelon form:**

Apply $R_3 \leftarrow R_3 - R_1$ (subtract row 1 from row 3):

$$
\begin{bmatrix} 1 & 2 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 1 \end{bmatrix}
$$

Apply $R_3 \leftarrow R_3 - R_2$ (subtract row 2 from row 3):

$$
\begin{bmatrix} 1 & 2 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \end{bmatrix}
$$

**Step 3 — Identify pivot columns:**

A **pivot** is the first nonzero entry in each row of the echelon form:
- Row 1: pivot in **column 1** (the entry $1$)
- Row 2: pivot in **column 3** (the entry $1$; column 2 is zero, so it's skipped)
- Row 3: all zeros — no pivot

So the **pivot columns are 1 and 3**.

**Step 4 — Go back to the original vectors at those column positions:**

- Column 1 → $v_1 = (1,0,1)$ ✓
- Column 3 → $v_3 = (0,1,1)$ ✓
- Column 2 ($v_2$) is **not** a pivot column, meaning $v_2$ is redundant — it can be written as a combination of the pivot-column vectors.

Indeed, $v_2 = (2,0,2) = 2 \times (1,0,1) = 2\,v_1$, so it adds nothing new.

**Answer — Basis:** $\{v_1,\, v_3\} = \{(1,0,1),\ (0,1,1)\}$.

These two vectors are independent (neither is a scaled copy of the other) and any vector that was in $\mathrm{span}\{v_1,v_2,v_3\}$ can still be built from just $v_1$ and $v_3$.

> **Key takeaway:** "Pivot columns" in the row-reduced matrix tell you *which original vectors to keep*. Non-pivot columns correspond to vectors that are dependent on (built from) the pivot-column vectors and can be dropped.

**Example 2C — Gram-Schmidt (2 vectors)**

Orthonormalize $x_1=(1,1)$ and $x_2=(1,0)$.

Step 1: $u_1 = (1,1)$, $\|u_1\|=\sqrt{2}$, so $e_1 = \frac{1}{\sqrt{2}}(1,1)$.

Step 2:

$$
\mathrm{proj}_{e_1}(x_2) = (x_2 \cdot e_1)\,e_1 = \frac{1}{\sqrt{2}} \cdot \frac{1}{\sqrt{2}}(1,1) = \frac{1}{2}(1,1) = (0.5, 0.5)
$$

$$
u_2 = x_2 - \mathrm{proj}_{e_1}(x_2) = (1,0)-(0.5,0.5) = (0.5,-0.5)
$$

$$
\|u_2\| = \sqrt{0.25+0.25} = \frac{1}{\sqrt{2}},\quad e_2 = \frac{1}{\sqrt{2}}(1,-1)
$$

**Orthonormal basis:** $e_1=\frac{1}{\sqrt{2}}(1,1)$, $e_2=\frac{1}{\sqrt{2}}(1,-1)$.

Check: $e_1 \cdot e_2 = \frac{1}{2}(1-1) = 0$ ✓, $\|e_1\|=\|e_2\|=1$ ✓.

---

### Module 3 — Matrix Decompositions (Eigen, Spectral, Cholesky, SVD)

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
If $A\in\mathbb{R}^{n\times n}$ is symmetric, it has an orthonormal eigenbasis and real eigenvalues.
- Decomposition:
 - $$A = Q\Lambda Q^T$$
 - where columns of $Q$ are orthonormal eigenvectors and $\Lambda$ is diagonal of eigenvalues.

Also used in ML context: $A^T A$ and $A A^T$ are symmetric; appear in SVD and PCA.

### Cholesky decomposition (SPD matrices)
If $A$ is symmetric positive definite, then
$$A = L L^T$$
with $L$ lower-triangular with positive diagonal.

Determinant via Cholesky (slides):
$$\det(A)=\det(L)\det(L^T)=\det(L)^2=(\prod_i L_{ii})^2.$$

### Singular Value Decomposition (SVD)
For any $A\in\mathbb{R}^{m\times n}$:
$$A = U\Sigma V^T$$
- $U\in\mathbb{R}^{m\times m}$ orthogonal
- $V\in\mathbb{R}^{n\times n}$ orthogonal
- $\Sigma$ diagonal (rectangular) with singular values $\sigma_1\ge\sigma_2\ge\cdots\ge 0$

Truncated SVD / rank-$k$ approximation:
$$A_k = U_k\Sigma_k V_k^T$$
(keep top $k$ singular values).

### Symbol guide & simple examples (Module 3)

| Symbol | Read as | What it means |
|---|---|---|
| $\lambda$ | "lambda" | Eigenvalue — the scaling factor when a matrix acts on its eigenvector |
| $x$ (in $Ax=\lambda x$) | "eigenvector" | A special direction that the matrix only stretches (never rotates) |
| $\det(A)$ | "determinant of A" | A single number summarizing how $A$ scales volume; $\det=0$ means the matrix squishes space flat |
| $I$ | "identity matrix" | The "do nothing" matrix: $AI=A$. Diagonal of 1s, everything else 0 |
| $E_\lambda$ | "eigenspace for lambda" | All eigenvectors (plus zero) sharing the same eigenvalue $\lambda$ |
| $\mathcal{N}(M)$ | "null space of M" | All vectors $x$ such that $Mx=0$ |
| $Q$ | "Q" | Matrix whose columns are the eigenvectors (orthonormal if $A$ is symmetric) |
| $\Lambda$ | "capital lambda" | Diagonal matrix of eigenvalues: $\Lambda = \mathrm{diag}(\lambda_1,\dots,\lambda_n)$ |
| $\Sigma$ | "capital sigma" | Diagonal matrix of singular values in SVD (not summation here) |
| $\sigma_i$ | "sigma-i" | The $i$-th singular value — measures how much SVD stretches along direction $i$ |
| $U, V$ | "U, V" | Orthogonal matrices in SVD; $U$ = left directions, $V$ = right directions |
| $L$ | "L" | Lower-triangular matrix in Cholesky: $A=LL^T$ |
| $\prod_{i=1}^{n}$ | "product from i=1 to n" | Multiply terms together: $\prod_{i=1}^{3} a_i = a_1 \cdot a_2 \cdot a_3$ |

**Analogy — Eigenvalues and eigenvectors:**

Imagine stretching a rubber sheet pinned at the origin. Most points move *and* rotate, but some special directions only get stretched (or compressed). Those directions are **eigenvectors**, and how much they stretch is the **eigenvalue**.

- $\lambda > 1$: stretched out
- $0 < \lambda < 1$: compressed
- $\lambda < 0$: flipped and stretched

**Simple example — Eigenvalues of a 2x2:**

$$
A = \begin{bmatrix} 2 & 1 \\\\ 0 & 3 \end{bmatrix}
$$

Since $A$ is upper-triangular, eigenvalues are the diagonal entries: $\lambda_1=2,\ \lambda_2=3$.

For $\lambda_1=2$: solve $(A-2I)x=0$:

$$
\begin{bmatrix} 0 & 1 \\\\ 0 & 1 \end{bmatrix} x = 0 \implies x = t\begin{bmatrix}1\\\\0\end{bmatrix}
$$

So eigenvector for $\lambda=2$ is $(1,0)$.

**Analogy — SVD:**

Any matrix transformation can be broken into 3 steps: (1) rotate/reflect ($V^T$), (2) stretch along axes ($\Sigma$), (3) rotate/reflect again ($U$). SVD finds exactly these three pieces.

**Simple example — Product symbol** $\prod$**:**

If a triangular matrix has diagonal entries $2, 3, 5$, then:

$$
\det = \prod_{i=1}^{3} u_{ii} = 2 \times 3 \times 5 = 30
$$

### questions (Module 3)

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
2. Verify positive definiteness 
   - (often via Sylvester’s criterion: leading principal minors $>0$).
3. Solve for $L$ in $A=LL^T$ entry-by-entry (as in the 2×2 example in slides).

**D) Low-rank approximation via truncated SVD**
1. Compute SVD $A=U\Sigma V^T$.
2. Choose $k$.
3. Keep top $k$ components → $A_k$.

### Worked examples (Module 3)

**Example 3A — Find eigenvalues and eigenvectors**

$$
A = \begin{bmatrix} 4 & 1 \\\\ 2 & 3 \end{bmatrix}
$$

Step 1 — Characteristic equation:

$$
\det(A-\lambda I) = (4-\lambda)(3-\lambda) - 2 = \lambda^2 - 7\lambda + 10 = 0
$$

$$
(\lambda-5)(\lambda-2) = 0 \implies \lambda_1=5,\ \lambda_2=2
$$

Step 2 — Eigenvectors:

For $\lambda_1=5$: $(A-5I)x=0$:

$$
\begin{bmatrix} -1 & 1 \\\\ 2 & -2 \end{bmatrix} x = 0 \implies x_1=x_2 \implies v_1 = (1,1)
$$

For $\lambda_2=2$: $(A-2I)x=0$:

$$
\begin{bmatrix} 2 & 1 \\\\ 2 & 1 \end{bmatrix} x = 0 \implies x_1 = -x_2/2 \implies v_2 = (1,-2)
$$

**Example 3B — Diagonalize**

Using the eigenvalues/vectors above:

$$
Q = \begin{bmatrix} 1 & 1 \\\\ 1 & -2 \end{bmatrix},\quad \Lambda = \begin{bmatrix} 5 & 0 \\\\ 0 & 2 \end{bmatrix}
$$

Verify: $A = Q\Lambda Q^{-1}$.

**Example 3C — Cholesky factorization**

$$
A = \begin{bmatrix} 4 & 2 \\\\ 2 & 5 \end{bmatrix}
$$

Check SPD: $A^T=A$ ✓. Leading minors: $4>0$, $\det(A)=20-4=16>0$ ✓.

Solve $A=LL^T$:

$$
L = \begin{bmatrix} l_{11} & 0 \\\\ l_{21} & l_{22} \end{bmatrix}
$$

From $l_{11}^2=4$: $l_{11}=2$.

From $l_{21} \cdot l_{11}=2$: $l_{21}=1$.

From $l_{21}^2 + l_{22}^2=5$: $l_{22}=2$.

$$
L = \begin{bmatrix} 2 & 0 \\\\ 1 & 2 \end{bmatrix}
$$

Verify: $\det(A) = (l_{11} \cdot l_{22})^2 = (2 \cdot 2)^2 = 16$ ✓.

---

## Module 4 — Vector Calculus 
- (Derivatives, Gradients, Taylor, Hessian, Backprop)

### Taylor’s theorem (1D, with remainder) (as shown)
If $f$ is $n$-times differentiable, then for some $c\in(a,b)$:
$$f(b)=\sum_{k=0}^{n-1}\frac{f^{(k)}(a)}{k!}(b-a)^k + \frac{f^{(n)}(c)}{n!}(b-a)^n.$$

Mean Value Theorem (special case $n=1$):
$$f'(c)=\frac{f(b)-f(a)}{b-a}.$$

### Taylor in two variables (2nd order form shown)
Let $h,k$ be small increments:
- $$f(a+h,b+k)=f(a,b)+h f_x(a,b)+k f_y(a,b)+\frac{1}{2}\left(h^2 f_{xx}+2hk f_{xy}+k^2 f_{yy}\right)\big|_{(a+ch,b+ck)}$$
for some $c\in(0,1)$.

### Hessian (2 variables)

$$
H_f(x,y) = \begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \end{bmatrix}
$$

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
- Chain rule reuse idea:
Compute partials from output backwards so intermediate derivatives can be reused.

### Symbol guide & simple examples (Module 4)

| Symbol | Read as | What it means |
|---|---|---|
| $\nabla f$ | "nabla f" or "gradient of f" | A vector of all partial derivatives; points in the direction of steepest increase |
| $f_x$ or $\frac{\partial f}{\partial x}$ | "partial f partial x" | How fast $f$ changes when you nudge only $x$, keeping everything else fixed |
| $f_{xx}$ | "f double-x" | Second partial derivative: the rate of change *of the rate of change* w.r.t. $x$ |
| $f_{xy}$ | "f sub x-y" | Mixed partial: first differentiate w.r.t. $x$, then w.r.t. $y$ |
| $H_f$ | "Hessian of f" | Matrix of all second partial derivatives — tells you about curvature |
| $D$ | "discriminant" | $D = f_{xx}f_{yy} - (f_{xy})^2$; its sign classifies critical points |
| $k!$ | "k factorial" | Multiply all integers from 1 to $k$: $4!=4{\cdot}3{\cdot}2{\cdot}1=24$ |
| $f^{(k)}$ | "f to the k-th" | The $k$-th derivative of $f$ |
| $\approx$ | "approximately equal" | Left side is close to, but not exactly, the right side |
| $\phi$ | "phi" | Activation function in a neural network (e.g. ReLU, sigmoid) |
| $\theta$ | "theta" | Collective name for all learnable parameters of a model |
| $L(\theta)$ | "loss of theta" | A single number measuring how wrong the model's predictions are |

**Analogy — Gradient:**

You are standing on a hillside and want to know which direction is steepest uphill. The **gradient** $\nabla f$ is an arrow pointing exactly that way. Its length tells you how steep it is. Walking opposite to the gradient takes you downhill fastest — that is gradient descent.

**Analogy — Hessian:**

The gradient tells you the slope; the **Hessian** tells you the *curvature* — is the slope getting steeper (bowl-shaped = minimum) or flatter (hilltop = maximum)?

**Simple example — Gradient and critical points:**

Let $f(x,y)=x^2+y^2$.

$$
f_x=2x,\quad f_y=2y,\quad \nabla f=(2x,\; 2y)
$$

Set gradient to zero: $2x=0,\ 2y=0 \implies$ critical point at $(0,0)$.

$$
f_{xx}=2,\quad f_{yy}=2,\quad f_{xy}=0
$$

$$
D = 2 \cdot 2 - 0^2 = 4 > 0,\quad f_{xx}=2>0 \implies \text{local minimum at } (0,0)
$$

**Simple example — Taylor (1D):**

Approximate $e^x$ around $a=0$ (2nd order):

$$
e^x \approx 1 + x + \frac{x^2}{2}
$$

At $x=0.1$: exact $e^{0.1}=1.10517...$, approximation $= 1+0.1+0.005=1.105$. Very close!

### questions (Module 4)

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

### Worked examples (Module 4)

**Example 4A — Find local extrema of $f(x,y) = x^2 + xy + y^2 - 3x$**

Step 1 — Partial derivatives:

$$
f_x = 2x + y - 3,\quad f_y = x + 2y
$$

Step 2 — Set to zero:

$$
2x + y = 3,\quad x + 2y = 0
$$

From second equation: $x = -2y$. Substitute: $-4y+y=3 \implies y=-1,\ x=2$.

Critical point: $(2,-1)$.

Step 3 — Second derivatives and discriminant:

$$
f_{xx}=2,\quad f_{yy}=2,\quad f_{xy}=1
$$

$$
D = 2{\cdot}2 - 1^2 = 3 > 0,\quad f_{xx}=2>0
$$

**Answer:** Local minimum at $(2,-1)$, with $f(2,-1) = 4-2+1-6 = -3$.

**Example 4B — 2nd-order Taylor expansion of $f(x)=\sin(x)$ around $a=0$**

Derivatives at $a=0$: $f(0)=0$, $f'(0)=\cos(0)=1$, $f''(0)=-\sin(0)=0$.

$$
\sin(x) \approx 0 + 1{\cdot}x + \frac{0}{2}x^2 = x
$$

So near $x=0$, $\sin(x) \approx x$. (At $x=0.1$: $\sin(0.1)=0.09983...$, approximation $=0.1$. Close!)

**Example 4C — Backprop on a simple chain**

Compute $\frac{dL}{dx}$ for: $a = 2x$, $b = a+3$, $L = b^2$.

Forward: if $x=1$, then $a=2$, $b=5$, $L=25$.

Backward (chain rule):

$$
\frac{dL}{db}=2b=10,\quad \frac{db}{da}=1,\quad \frac{da}{dx}=2
$$

$$
\frac{dL}{dx} = \frac{dL}{db} \cdot \frac{db}{da} \cdot \frac{da}{dx} = 10 \cdot 1 \cdot 2 = 20
$$

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
At optimum $(x^\ast,\lambda^\ast,\nu^\ast)$:
- **Primal feasibility:** $g_i(x^\ast)\le 0$, $h_j(x^\ast)=0$
- **Dual feasibility:** $\lambda_i^\ast\ge 0$
- **Complementary slackness:** $\lambda_i^\ast\,g_i(x^\ast)=0$
- **Stationarity:**

$$
\nabla f(x^\ast) + \sum_{i=1}^m \lambda_i^\ast\,\nabla g_i(x^\ast) + \sum_{j=1}^p \nu_j^\ast\,\nabla h_j(x^\ast) = 0.
$$

Quick-use equivalent (often the cleanest way to write stationarity):
$$\nabla_x L(x^\ast,\lambda^\ast,\nu^\ast)=0,$$
where
$$L(x,\lambda,\nu)=f(x)+\sum_{i=1}^m \lambda_i g_i(x)+\sum_{j=1}^p \nu_j h_j(x),\quad \lambda_i\ge 0.$$

### Convexity criterion (slides)
Convex set: $x,y\in C\Rightarrow \theta x+(1-\theta)y\in C$.

Convex function:
$$f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y).$$
Gradient (first-order) condition:
$$f(y)\ge f(x)+\nabla f(x)^T(y-x).$$

### Symbol guide & simple examples (Module 5)

| Symbol | Read as | What it means |
|---|---|---|
| $\min_x f(x)$ | "minimize f over x" | Find the value of $x$ that makes $f(x)$ as small as possible |
| $\alpha$ (in GD) | "alpha" / "learning rate" | Step size — how big a step you take downhill each iteration |
| $x_{i+1}$ | "x sub i+1" | The updated point after one gradient descent step |
| $\nabla f(x_i)$ | "gradient at x-i" | The steepest-uphill direction at point $x_i$ |
| $\text{s.t.}$ | "subject to" | Shorthand for "with the constraint that ..." |
| $g_i(x) \le 0$ | "g-i of x <= 0" | An inequality constraint the solution must satisfy |
| $h_j(x) = 0$ | "h-j of x = 0" | An equality constraint the solution must satisfy |
| $\lambda_i$ (in KKT) | "lambda-i" | Lagrange multiplier for the $i$-th inequality constraint; measures how much that constraint "costs" |
| $\nu_j$ | "nu-j" | Lagrange multiplier for the $j$-th equality constraint |
| $x^\ast$ | "x star" | The optimal solution |
| $\mu$ (in momentum) | "mu" | Momentum coefficient — how much of the previous step's velocity to keep |
| $v_i$ | "velocity at step i" | Momentum term that carries forward previous movement |

**Analogy — Gradient descent:**

You feel the slope under your feet (gradient) and take a step downhill. Repeat. The **learning rate** $\alpha$ is your step size — too big and you overshoot the valley, too small and you take forever.

**Analogy — Lagrange multipliers:**

You want the cheapest hotel room (minimize cost) but it must be within 1 km of the beach (constraint). The Lagrange multiplier $\lambda$ tells you: "if the beach constraint were relaxed by 1 metre, how much cheaper could your room be?" It prices the constraint.

**Simple example — One step of gradient descent:**

$$
f(x) = x^2,\quad f'(x)=2x
$$

Start at $x_0=5$, learning rate $\alpha=0.1$:

$$
x_1 = x_0 - \alpha f'(x_0) = 5 - 0.1(10) = 4
$$

$$
x_2 = 4 - 0.1(8) = 3.2
$$

Each step moves closer to the minimum at $x=0$.

**Simple example — Complementary slackness (KKT):**

Minimize $f(x) = x^2$ subject to $g(x) = x - 3 \le 0$ (i.e., $x \le 3$).

The unconstrained minimum is at $x=0$, which already satisfies $x \le 3$. So the constraint is **inactive** ($g(0)=-3 < 0$), and complementary slackness forces $\lambda = 0$ — the constraint has zero cost because it was not binding.

### questions (Module 5)

**A) Run gradient descent**
1. Compute gradient $\nabla f$.
2. Choose $\alpha$ (small) and initialization $x_0$.
3. Iterate $x_{k+1}=x_k-\alpha\nabla f(x_k)$ until convergence.
4. Stop when $|f(x_{k+1})-f(x_k)|$ is small or $\|\nabla f(x_k)\|$ is small.

**B) Form a constrained optimization using Lagrange multipliers**
1. Write constraints as $g_i(x)\le0$ and $h_j(x)=0$.
2. Write Lagrangian $L(x,\lambda,\nu)$.
3. Apply KKT (or for equality-only constraints: solve $\nabla f=\lambda\nabla g$ + constraint).

### Worked examples (Module 5)

**Example 5A — Gradient descent on $f(x)=x^4-3x^2+2$**

$$
f'(x) = 4x^3 - 6x
$$

Start at $x_0=2$, learning rate $\alpha=0.01$.

| Step | $x$ | $f'(x)$ | $x_{\text{new}} = x - 0.01 f'(x)$ |
|---|---|---|---|
| 0 | $2$ | $4(8)-12=20$ | $2-0.2=1.8$ |
| 1 | $1.8$ | $4(5.832)-10.8=12.528$ | $1.8-0.125=1.675$ |
| 2 | $1.675$ | $\approx 8.75$ | $\approx 1.587$ |

The iterates approach the local minimum near $x \approx 1.22$ (where $f'(x)=0$).

**Example 5B — Lagrange multiplier (equality constraint)**

Minimize $f(x,y)=x^2+y^2$ subject to $h(x,y)=x+y-4=0$.

Lagrangian:

$$
L(x,y,\nu) = x^2+y^2 + \nu(x+y-4)
$$

Stationarity:

$$
\frac{\partial L}{\partial x} = 2x+\nu = 0,\quad \frac{\partial L}{\partial y} = 2y+\nu = 0
$$

From these: $2x=2y \implies x=y$. Plug into constraint: $2x=4 \implies x=y=2$.

Then $\nu = -2(2)=-4$.

**Answer:** Minimum at $(2,2)$ with $f=8$. The multiplier $\nu=-4$ means relaxing the constraint by $\epsilon$ would decrease $f$ by about $4\epsilon$.

**Example 5C — KKT with inequality constraint**

Minimize $f(x)=(x-3)^2$ subject to $g(x)=x-1 \le 0$ (i.e., $x \le 1$).

Unconstrained minimum is at $x=3$, which violates $x \le 1$. So the constraint must be active.

At $x^\ast=1$: $g(1)=0$ (active), $f'(1)=2(1-3)=-4$.

Stationarity: $f'(x^\ast)+\lambda g'(x^\ast)=0 \implies -4+\lambda(1)=0 \implies \lambda=4$.

Check: $\lambda=4 \ge 0$ ✓, $\lambda \cdot g(x^\ast)=4{\cdot}0=0$ ✓ (complementary slackness).

**Answer:** $x^\ast=1$, $\lambda^\ast=4$.

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
- Lagrangian leads to eigenproblem:
$$S b_1 = \lambda b_1.$$
So $b_1$ is eigenvector of $S$ with largest eigenvalue.

### SVM: linear classifier geometry
Hyperplane:
$$w^T x + b = 0.$$
$w$ is normal to the separating hyperplane.

### Hard-margin SVM
$$\min_{w,b} \frac{1}{2}\|w\|_2^2\ \text{s.t. } y_n(w^T x_n + b)\ge 1,\ \forall n.$$

### Soft-margin SVM
Introduce slack variables $\xi_n\ge 0$:

$$
\min_{w,b,\xi}\ \frac{1}{2}\|w\|_2^2 + C\sum_{n=1}^N \xi_n
$$

subject to

$$
y_n\,(w^T x_n + b)\ge 1-\xi_n,\quad \xi_n\ge 0,\quad n=1,\dots,N.
$$

Simple “margin” form (helps quickly check constraint violations):
$$m_n = y_n(w^T x_n+b),\quad \text{constraint is } m_n\ge 1-\xi_n.$$

### Hinge loss
For a point $(x_n,y_n)$:

$$
\ell_n = \max\big(0,\ 1 - y_n(w^T x_n + b)\big).
$$

Soft-margin objective (common equivalent form shown in examples):

$$
\min_{w,b}\ \frac{1}{2}\|w\|_2^2 + C\sum_{n=1}^N \max\big(0,\ 1-y_n(w^T x_n + b)\big).
$$

Quick-use equivalent (using margin $m_n$):
$$\ell_n = \max(0,1-m_n),\quad m_n=y_n(w^T x_n+b).$$


### Writing the hinge-loss SVM objective for a given dataset (step-by-step)

Let $w = (w_1, w_2)^T$ and the decision function be $f(x) = w_1 x_1 + w_2 x_2 + b$.

**Step 1 — Write the hinge loss $L_n$ for each point:**

For each point $(x_n, y_n)$, expand $L_n = \max\big(0, 1 - y_n(w^T x_n + b)\big)$:

- **Positive class** ($y_n = +1$): $L_n = \max\big(0, 1 - (w_1 x_1 + w_2 x_2 + b)\big)$
- **Negative class** ($y_n = -1$): $L_n = \max\big(0, 1 - (-1)(w_1 x_1 + w_2 x_2 + b)\big) = \max\big(0,\; 1 + w_1 x_1 + w_2 x_2 + b\big)$

Notice: for $y=-1$ the sign inside flips, so you get $1 + (\text{score})$ instead of $1 - (\text{score})$.

**Concrete example** using the dataset from the sample question:

| Point | $x$ | $y$ |
|---|---|---|
| $X_1$ | $(2,2)$ | $+1$ |
| $X_2$ | $(4,4)$ | $+1$ |
| $X_3$ | $(2,0)$ | $-1$ |
| $X_4$ | $(4,0)$ | $-1$ |

Hinge loss for each point:

$$
L_1 = \max\big(0, 1 - (w_1(2) + w_2(2) + b)\big) = \max(0,\; 1 - 2w_1 - 2w_2 - b)
$$

$$
L_2 = \max\big(0, 1 - (w_1(4) + w_2(4) + b)\big) = \max(0,\; 1 - 4w_1 - 4w_2 - b)
$$

$$
L_3 = \max\big(0, 1 - (-1)(w_1(2) + w_2(0) + b)\big) = \max(0,\; 1 + 2w_1 + b)
$$

$$
L_4 = \max\big(0, 1 - (-1)(w_1(4) + w_2(0) + b)\big) = \max(0,\; 1 + 4w_1 + b)
$$

**Step 2 — Write the full hinge-loss SVM objective:**

$$
J(w_1, w_2, b) = \frac{1}{2}(w_1^2 + w_2^2) + C\Big[L_1 + L_2 + L_3 + L_4\Big]
$$

where each $L_i$ is defined above.

> **tip:** You are not asked to minimize this by hand. The question typically asks you to (a) write out this objective, or (b) plug in specific $(w, b)$ values to compare two candidate models.

### Kernels
Kernel is an inner product in feature space:
$$K(x_i,x_j)=\phi(x_i)^T\phi(x_j).$$
Examples shown:
- Linear: $K(x_i,x_j)=x_i^T x_j$
- Polynomial degree $p$: $K(x_i,x_j)=(1+x_i^T x_j)^p$
- Sigmoid: $K(x_i,x_j)=\tanh(\alpha_0 x_i^T x_j + \alpha_1)$

### KKT + duality
KKT conditions listed in Module 5 apply; strong duality under Slater’s condition (convex + strict feasibility).
### Symbol guide & simple examples (Module 6)

| Symbol | Read as | What it means |
|---|---|---|
| $S$ | "covariance matrix" | Measures how much features vary together; entry $S_{ij}$ = covariance of feature $i$ and $j$ |
| $\mathbb{E}[x]$ | "expected value of x" | The average/mean of $x$ |
| $B$ | "projection matrix" | Matrix whose columns are the chosen PCA directions |
| $z$ | "code" or "embedding" | The low-dimensional representation after projecting with $B^T$ |
| $\hat{x}$ | "x hat" | Reconstructed (approximate) version of $x$ from the low-dim code |
| $b_1$ | "b-one" | First principal component direction — captures the most variance |
| $w$ | "weight vector" | The normal to the SVM separating hyperplane; defines the classifier |
| $b$ (in SVM) | "bias" | Shifts the hyperplane away from the origin |
| $y_n \in \{-1,+1\}$ | "label" | Class label: $+1$ for one class, $-1$ for the other |
| $\xi_n$ | "xi-n" ("ksi-n") | Slack variable — how much a point violates the margin; $\xi=0$ means no violation |
| $C$ | "C" | Regularization parameter — large $C$ penalizes violations heavily (hard margin); small $C$ allows more slack |
| $m_n$ | "margin of point n" | $m_n=y_n(w^T x_n+b)$; if $m_n \ge 1$ the point is correctly classified with margin |
| $K(x_i,x_j)$ | "kernel of x-i, x-j" | Similarity score between $x_i$ and $x_j$ computed in a higher-dimensional feature space without explicitly going there |
| $\phi(x)$ | "phi of x" | Feature map — transforms $x$ into a higher-dimensional space |

**Analogy — PCA:**

Imagine a cloud of 3D points that mostly lies along a flat pancake-shape. PCA finds the pancake's flat directions (the two axes with the most spread). You can then describe each point by just 2 numbers instead of 3, losing very little information. The first principal component is the direction with the most spread.

**Simple example — PCA on 2D data (reduce to 1D):**

Suppose centered data points: $(-1,-1), (0,0), (1,1)$.

Covariance:

$$
S = \frac{1}{3}\begin{bmatrix} 2 & 2 \\\\ 2 & 2 \end{bmatrix}
$$

Eigenvalues of $S$: $\lambda_1 = 4/3,\ \lambda_2 = 0$.

Top eigenvector: $b_1 = \frac{1}{\sqrt{2}}(1,1)$ (the 45-degree line). PCA says: project everything onto this line. Point $(1,1)$ gets code $z = b_1^T (1,1) = \sqrt{2}$.

**Analogy — SVM:**

You have red and blue balls on a table and want to draw a straight line separating them. Many lines work, but SVM picks the one with the **widest street** (margin) between the classes. The balls touching the edge of the street are the **support vectors**.

**Simple example — Hinge loss:**

Suppose $w=(1),\ b=-2$, and point $x=3$ with label $y=+1$.

Score: $s = w^T x + b = 3 - 2 = 1$.

Margin: $m = y \cdot s = 1 \cdot 1 = 1$.

Hinge loss: $\ell = \max(0, 1-1) = 0$. (Correctly classified with full margin, so zero loss.)

Now if $x=2$: $s=0,\ m=0,\ \ell=\max(0,1-0)=1$. (Inside the margin, so penalized.)

**Analogy — Kernel trick:**

If red and blue balls cannot be separated by a straight line on a flat table, lift them into 3D space (feature map $\phi$). In 3D, a flat plane can separate them. The **kernel** lets you compute the "lifted" dot product without actually computing all the 3D coordinates — saving a lot of work.
### questions (Module 6)

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

### Worked examples (Module 6)

**Example 6A — PCA on 3 points in 2D**

Data: $(2,4),\ (4,6),\ (6,8)$. Mean $\mu=(4,6)$.

Center: $(-2,-2),\ (0,0),\ (2,2)$.

Covariance:

$$
S = \frac{1}{3}\left[(-2)(-2)+0+4,\ \dots\right] = \frac{1}{3}\begin{bmatrix} 8 & 8 \\\\ 8 & 8 \end{bmatrix}
$$

Eigenvalues: $\det(S-\lambda I)=0 \implies \lambda_1=16/3,\ \lambda_2=0$.

Top eigenvector: $b_1=\frac{1}{\sqrt{2}}(1,1)$.

Project centered point $(2,2)$: $z = b_1^T(2,2) = \frac{1}{\sqrt{2}}(2+2)=2\sqrt{2}$.

Reconstruct: $\hat{x} = z \cdot b_1 = 2\sqrt{2} \cdot \frac{1}{\sqrt{2}}(1,1) = (2,2)$. (Perfect reconstruction since all points lie on a line.)

**Example 6B — Soft-margin SVM formulation & hinge loss**

Data: $x_1=(1),\ y_1=+1$ and $x_2=(-1),\ y_2=-1$. Choose $C=10$.

Propose $w=1,\ b=0$ (hyperplane at $x=0$).

Point 1: $s_1=w^T x_1+b=1$, $m_1=y_1 s_1=1$, $\ell_1=\max(0,1-1)=0$.

Point 2: $s_2=-1$, $m_2=(-1)(-1)=1$, $\ell_2=\max(0,1-1)=0$.

Objective:

$$
\frac{1}{2}\|w\|^2 + C(\ell_1+\ell_2) = \frac{1}{2}(1) + 10(0) = 0.5
$$

Both margins are exactly 1 — points sit on the margin boundary (they are support vectors).

Now try $w=0.5,\ b=0$:

Point 1: $s_1=0.5$, $m_1=0.5$, $\ell_1=\max(0,0.5)=0.5$.

Point 2: $s_2=-0.5$, $m_2=0.5$, $\ell_2=0.5$.

Objective:

$$
\frac{1}{2}(0.25) + 10(1.0) = 0.125 + 10 = 10.125
$$

Much worse! The smaller $w$ reduces the regularization term but the margin violations are heavily penalized by $C=10$. The first solution ($w=1, b=0$) is better.

**Example 6C — Polynomial kernel**

Points: $x_1=(1)$, $x_2=(2)$. Polynomial kernel of degree 2:

$$
K(x_i,x_j) = (1 + x_i^T x_j)^2
$$

$$
K(x_1,x_1) = (1+1)^2 = 4
$$

$$
K(x_1,x_2) = (1+2)^2 = 9
$$

$$
K(x_2,x_2) = (1+4)^2 = 25
$$

This is equivalent to using the feature map $\phi(x) = (1, \sqrt{2}x, x^2)$ and computing $\phi(x_i)^T \phi(x_j)$, but the kernel computes it directly from the original data — no need to explicitly build $\phi$.

---

## If you want this as a printable formula sheet
Tell me if you prefer:
- a shorter 2–3 page “exam crib” version, or
- a longer version with worked mini-examples per module.

---

## Extra exam-style worked examples (based on MFML Regular EndSem patterns)

These are **additional** worked examples (not replacing anything above). Each example explicitly states the **module**, the **key formulas**, and the **steps**.

### Example set A — Linear dependence, span, rank, determinant

**Module(s):** Module 1 (rank/determinant), Module 2 (dependence/span/basis)

**Formulas used:**
- Linear dependence test: put vectors as columns of $A$, row-reduce.
- Rank: $\mathrm{rank}(A)$ = number of pivot columns.
- Determinant (3×3): compute by expansion or row-reduction.

**Problem A1 — Dependence in $\mathbb{R}^4$ and basis for the span**

Let

$$
u_1=(1,0,1,0),\quad u_2=(2,0,2,0),\quad u_3=(0,1,0,1),\quad u_4=(1,1,1,1).
$$

1) Are $\{u_1,u_2,u_3,u_4\}$ linearly independent in $\mathbb{R}^4$?

2) Let $U=\mathrm{span}\{u_1,u_2,u_3,u_4\}$. Find a basis and $\dim(U)$.

**Step 1 — Put vectors as columns and row-reduce:**

$$
A=\begin{bmatrix}
1 & 2 & 0 & 1 \\
0 & 0 & 1 & 1 \\
1 & 2 & 0 & 1 \\
0 & 0 & 1 & 1
\end{bmatrix}
$$

Do $R_3\leftarrow R_3-R_1$ and $R_4\leftarrow R_4-R_2$:

$$
\begin{bmatrix}
1 & 2 & 0 & 1 \\
0 & 0 & 1 & 1 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0
\end{bmatrix}
$$

**Step 2 — Read pivots:** pivots are in **columns 1 and 3**.

So the pivot columns correspond to $u_1$ and $u_3$.

**Answer (1):** Dependent (since there are only 2 pivots for 4 vectors).

**Answer (2):** A basis is $\{u_1,u_3\}$ and $\dim(U)=2$.

Quick redundancy check: $u_2=2u_1$ and $u_4=u_1+u_3$.

**Problem A2 — Rank and determinant of a 3×3**

Let

$$
B=\begin{bmatrix}
2 & 1 & 0 \\
0 & 3 & 1 \\
0 & 0 & 4
\end{bmatrix}
$$

This is upper triangular.

- **Rank:** all three diagonal entries are nonzero $\Rightarrow$ all three columns have pivots, so $\mathrm{rank}(B)=3$.

- **Determinant (triangular rule):**

$$
\det(B)=2\cdot 3\cdot 4=24.
$$

---

### Example set B — Eigenvalues, diagonalization, singular values

**Module:** Module 3

**Formulas used:**
- Eigenvalues: solve $\det(A-\lambda I)=0$.
- Eigenvectors: solve $(A-\lambda I)x=0$.
- Diagonalization (if possible): $A=PDP^{-1}$ with $P=[v_1\ \cdots\ v_n]$.
- Singular values: $\sigma_i=\sqrt{\lambda_i(A^T A)}$.

**Problem B1 — Eigenvalues/eigenvectors + diagonalization**

Let

$$
A=\begin{bmatrix}
4 & 0 \\
1 & 2
\end{bmatrix}
$$

**Step 1 — Eigenvalues:**

$$
\det(A-\lambda I)=\det\begin{bmatrix}4-\lambda & 0 \\\n+1 & 2-\lambda\end{bmatrix}=(4-\lambda)(2-\lambda)=0
$$

So $\lambda_1=4$, $\lambda_2=2$.

**Step 2 — Eigenvectors:**

For $\lambda=4$:

$$
(A-4I)=\begin{bmatrix}0 & 0 \\\n+1 & -2\end{bmatrix}\Rightarrow x_1-2x_2=0\Rightarrow v_1=(2,1)
$$

For $\lambda=2$:

$$
(A-2I)=\begin{bmatrix}2 & 0 \\\n+1 & 0\end{bmatrix}\Rightarrow x_1=0\Rightarrow v_2=(0,1)
$$

**Step 3 — Diagonalize:**

$$
P=\begin{bmatrix}2 & 0 \\\n+1 & 1\end{bmatrix},\quad D=\begin{bmatrix}4 & 0 \\\n+0 & 2\end{bmatrix}
$$

Then $A=PDP^{-1}$.

**Problem B2 — Singular values**

Let

$$
M=\begin{bmatrix}3 & 0 \\\n+0 & 1\end{bmatrix}
$$

Compute $M^T M$:

$$
M^T M=\begin{bmatrix}9 & 0 \\\n+0 & 1\end{bmatrix}
$$

Eigenvalues are $9$ and $1$, so the singular values are:

$$
\sigma_1=3,\quad \sigma_2=1.
$$

---

### Example set C — Inner product, induced norm, constrained optimization, KKT

**Module(s):** Module 2 (inner product / norm), Module 5 (Lagrangian, KKT)

**Formulas used:**
- Inner product: $\langle u,v\rangle_A=u^TAv$ with $A$ symmetric positive definite.
- Induced norm: $\|x\|_A=\sqrt{x^T A x}$.
- Lagrangian: $L(x,\lambda)=f(x)+\sum_i\lambda_i g_i(x)$ with $\lambda_i\ge 0$.
- KKT: primal feasibility, dual feasibility, complementary slackness, stationarity.

**Problem C1 — Check that $u^TAv$ is an inner product**

Let $A=\begin{bmatrix}2 & 0 \\\n+0 & 1\end{bmatrix}$. Define $\langle u,v\rangle_A=u^TAv$ on $\mathbb{R}^2$.

**Claim:** This is a valid inner product because $A$ is symmetric ($A^T=A$) and positive definite (for $x\ne 0$, $x^TAx=2x_1^2+x_2^2>0$).

So the induced norm is:

$$
\|x\|_A=\sqrt{2x_1^2+x_2^2}.
$$

**Problem C2 — Constrained minimization + KKT (simple, exam-style)**

Minimize

$$
f(x,y)=2\| (x,y)\|_A^2 = 2(2x^2+y^2)=4x^2+2y^2
$$

subject to

$$
g_1(x,y)=x+y-3\le 0,\quad g_2(x,y)=1-(x+y)\le 0
$$

(i.e., the strip $1\le x+y\le 3$).

**Step 1 — Lagrangian:**

$$
L(x,y,\lambda_1,\lambda_2)=4x^2+2y^2+\lambda_1(x+y-3)+\lambda_2(1-x-y)
$$

with $\lambda_1,\lambda_2\ge 0$.

**Step 2 — Stationarity:**

$$
\frac{\partial L}{\partial x}=8x+\lambda_1-\lambda_2=0
$$

$$
\frac{\partial L}{\partial y}=4y+\lambda_1-\lambda_2=0
$$

So $8x=4y\Rightarrow y=2x$.

**Step 3 — Use active constraint intuition:** minimizing a positive quadratic pulls toward $(0,0)$, but feasibility requires $x+y\ge 1$, so the optimum will lie on the boundary $x+y=1$.

Combine $y=2x$ with $x+y=1$:

$$
x+2x=1\Rightarrow x=\frac{1}{3},\quad y=\frac{2}{3}.
$$

**Step 4 — Check KKT conditions:**

- Primal feasibility: $x+y=1$ satisfies $1\le x+y\le 3$.
- Complementary slackness: $g_2=0$ is active so $\lambda_2$ may be $>0$; $g_1<0$ so $\lambda_1=0$.

With $\lambda_1=0$, stationarity gives $\lambda_2=8x=8/3$ (and also $=4y=8/3$), which is $\ge 0$.

**Answer:** optimum at $(x,y)=(1/3,\ 2/3)$.

---

### Example set D — Linear regression loss, Hessian convexity, gradient descent iterations

**Module(s):** Module 4 (Hessian/convexity), Module 5 (gradient descent mechanics)

**Formulas used:**
- Linear regression with bias: $\hat{y}=w_0+w_1x$.
- Squared error loss: $J(w_0,w_1)=\sum_{i=1}^n (y_i-(w_0+w_1x_i))^2$.
- Gradient descent: $w^{(t+1)}=w^{(t)}-\eta_t\nabla J(w^{(t)})$.
- Inverse decaying learning rate (one common form): $\eta_t=\frac{\eta_0}{1+k t}$.

**Problem D1 — Show $J$ is convex by Hessian**

Data: $(x,y)\in\{(1,2),(2,2),(3,4)\}$. Let $\hat{y}_i=w_0+w_1x_i$.

Loss:

$$
J(w_0,w_1)=\sum_{i=1}^3 (y_i-w_0-w_1x_i)^2
$$

Hessian (general result):

$$
\nabla^2 J = 2\begin{bmatrix}
n & \sum x_i \\
\sum x_i & \sum x_i^2
\end{bmatrix}
$$

Here $n=3$, $\sum x_i=6$, $\sum x_i^2=14$ so

$$
\nabla^2 J=2\begin{bmatrix}3 & 6 \\
6 & 14\end{bmatrix}
$$

This matrix is positive semidefinite because its leading principal minors are nonnegative:
- $2\cdot 3>0$
- determinant $=4(3\cdot 14-6\cdot 6)=4(42-36)=24>0$

So $\nabla^2J\succeq 0$ and $J$ is convex.

**Problem D2 — Two iterations of gradient descent with inverse decay**

Use the same dataset. Start at $w_0^{(0)}=0$, $w_1^{(0)}=0$.

Gradient components:

$$
\frac{\partial J}{\partial w_0}=-2\sum_{i=1}^n (y_i-w_0-w_1x_i),\quad
\frac{\partial J}{\partial w_1}=-2\sum_{i=1}^n x_i(y_i-w_0-w_1x_i)
$$

Learning rate schedule: $\eta_t=\frac{\eta_0}{1+k t}$ with $\eta_0=0.1$, $k=0.4$.

**Iteration 1 (t=1):** $\eta_1=0.1/(1.4)=0.071428\ldots$

At $(w_0,w_1)=(0,0)$, residuals are $[2,2,4]$.

$$
\frac{\partial J}{\partial w_0}=-2(2+2+4)=-16
$$

$$
\frac{\partial J}{\partial w_1}=-2(1\cdot 2+2\cdot 2+3\cdot 4)=-2(2+4+12)=-36
$$

Update:

$$
w_0^{(1)}=0-\eta_1(-16)=1.142857\ldots
$$

$$
w_1^{(1)}=0-\eta_1(-36)=2.571428\ldots
$$

**Iteration 2 (t=2):** $\eta_2=0.1/(1.8)=0.055555\ldots$

Compute predictions:
- At $x=1$: $\hat{y}=1.142857+2.571428=3.714285$ (residual $2-3.714285=-1.714285$)
- At $x=2$: $\hat{y}=1.142857+5.142856=6.285713$ (residual $2-6.285713=-4.285713$)
- At $x=3$: $\hat{y}=1.142857+7.714284=8.857141$ (residual $4-8.857141=-4.857141$)

Now:

$$
\frac{\partial J}{\partial w_0}=-2\sum r_i=-2(-10.857139)=21.714278
$$

$$
\frac{\partial J}{\partial w_1}=-2\sum x_ir_i=-2(1(-1.714285)+2(-4.285713)+3(-4.857141))=49.71427
$$

Update:

$$
w_0^{(2)}=w_0^{(1)}-\eta_2\cdot 21.714278\approx 1.142857-1.206349=-0.063492
$$

$$
w_1^{(2)}=w_1^{(1)}-\eta_2\cdot 49.71427\approx 2.571428-2.761904=-0.190476
$$

**Answer:** After 2 iterations, approximately $(w_0,w_1)\approx(-0.0635,\ -0.1905)$.

---

### Example set E — Hard-margin SVM primal + margin comparison

**Module:** Module 6

**Formulas used:**
- Hard-margin SVM primal:

$$
\min_{w,b}\ \frac{1}{2}\|w\|^2\ \text{s.t. } y_i(w^Tx_i+b)\ge 1\ \forall i
$$

- Margin of a given separating hyperplane $w^Tx+b=0$: geometric margin $\gamma=\min_i\frac{y_i(w^Tx_i+b)}{\|w\|}$.

**Problem E1 — Write the primal and compare two separating lines**

Data in $\mathbb{R}^2$:

- Positive (+1): $x_1=(0,2)$, $x_2=(2,2)$
- Negative (−1): $x_3=(0,0)$, $x_4=(2,0)$

**(a) Primal problem:**

$$
\min_{w\in\mathbb{R}^2,\ b\in\mathbb{R}}\ \frac{1}{2}\|w\|^2\quad \text{s.t.}\quad y_i(w^T x_i+b)\ge 1\ \ (i=1,\dots,4)
$$

**(b) Check that $x_2=1$ is separating:**

Line $x_2=1$ can be written as $w^Tx+b=0$ with $w=(0,1)$, $b=-1$.

Compute scores $s=w^Tx+b=x_2-1$:
- Positives: $s=2-1=1>0$
- Negatives: $s=0-1=-1<0$

So it separates.

Margin (geometric): distances are $|x_2-1|/\|w\|=1/1=1$ for closest points, so margin width is $2$.

**(c) Compare with line $x_2-x_1=0$:**

This is $w=(-1,1)$, $b=0$.

Scores $s=-x_1+x_2$:
- For $(2,2)$: $s=0$ (lies on the boundary) so it does **not** strictly separate these points.

So $x_2-x_1=0$ is not a valid separator for this dataset.

**Answer:** $x_2=1$ is a valid separating hyperplane with geometric margin $1$ to the closest point (margin width $2$). The second candidate fails to separate.
