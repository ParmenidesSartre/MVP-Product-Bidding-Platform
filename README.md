# MVP-Product-Bidding-Platform

# **Branching Strategy Guide**

## **Branch Types and Their Purpose**

### **1. Main Branch (`main`)**
- **Purpose:** The `main` branch represents the production-ready code. It is always stable, thoroughly tested, and ready to deploy.
- **Important Notes:**
  - **Direct commits** to `main` are not allowed. All changes must be merged through pull requests (PRs).
  - The `main` branch is protected by rules that require reviews and passing CI checks before any merge.

### **2. Develop Branch (`develop`)**
- **Purpose:** The `develop` branch is used for integrating features and bug fixes. It represents the latest development version, which is stable but not yet in production.
- **Important Notes:**
  - This branch is the base for all feature and bugfix branches.
  - All features and bug fixes are merged into `develop` before being prepared for release.

### **3. Feature Branches (`feature/xyz`)**
- **Purpose:** Feature branches are used for developing new features or enhancements. These branches are short-lived and created from `develop`.
- **Naming Convention:** `feature/<short-description>` or `feature/<issue-id>-<short-description>`
  - **Example:** `feature/add-product-listing`, `feature/123-enhance-notifications`
- **Important Notes:**
  - Feature branches should be merged into `develop` via pull requests once development is complete and code reviews have been conducted.

### **4. Bugfix Branches (`bugfix/xyz`)**
- **Purpose:** Bugfix branches are dedicated to resolving issues found in the `develop` branch. These are also short-lived.
- **Naming Convention:** `bugfix/<issue-id>` or `bugfix/<short-description>`
  - **Example:** `bugfix/456-fix-authentication`, `bugfix/fix-null-pointer`
- **Important Notes:**
  - Bugfix branches should be merged into `develop` via pull requests after fixing the issue and passing all tests.

### **5. Release Branches (`release/x.y.z`)**
- **Purpose:** Release branches are created from `develop` to prepare a new production release. These branches allow final touches, such as last-minute bug fixes and documentation updates.
- **Naming Convention:** `release/<version>`
  - **Example:** `release/1.0.0`
- **Important Notes:**
  - Once the release is ready, merge the release branch into both `main` and `develop`.

### **6. Hotfix Branches (`hotfix/xyz`)**
- **Purpose:** Hotfix branches are created from `main` to quickly address critical issues in production. These branches are also merged back into both `main` and `develop` to ensure consistency.
- **Naming Convention:** `hotfix/<short-description>` or `hotfix/<issue-id>-<short-description>`
  - **Example:** `hotfix/fix-prod-crash`, `hotfix/789-fix-production-outage`
- **Important Notes:**
  - Hotfix branches should be merged into `main` immediately after verification, followed by a merge into `develop`.

## **Workflow Examples**

### **1. Creating a Feature Branch**
- **Scenario:** You need to implement a new bidding feature.
- **Steps:**
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b feature/add-bidding-module
  ```
- **After Development:**
  - Push the branch to the remote repository:
    ```bash
    git push origin feature/add-bidding-module
    ```
  - Open a pull request against the `develop` branch for review and integration.

### **2. Fixing a Bug in Develop**
- **Scenario:** A bug is identified in the current development version.
- **Steps:**
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b bugfix/123-fix-bid-calculation
  ```
- **After Fixing:**
  - Push the branch to the remote repository:
    ```bash
    git push origin bugfix/123-fix-bid-calculation
    ```
  - Open a pull request against the `develop` branch for review and integration.

### **3. Preparing a Release**
- **Scenario:** The team is ready to prepare version 1.0.0 for production.
- **Steps:**
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b release/1.0.0
  ```
- **Final Changes:**
  - Push the branch to the remote repository:
    ```bash
    git push origin release/1.0.0
    ```
  - Once all is ready, open a pull request to merge into `main` and `develop`.

### **4. Hotfixing a Production Bug**
- **Scenario:** A critical bug is discovered in production.
- **Steps:**
  ```bash
  git checkout main
  git pull origin main
  git checkout -b hotfix/fix-prod-crash
  ```
- **After Fixing:**
  - Push the branch to the remote repository:
    ```bash
    git push origin hotfix/fix-prod-crash
    ```
  - Open pull requests to merge the hotfix into `main` and `develop`.

## **Branch Protection and Merging**

### **1. Branch Protection Rules**
- **Main Branch:**
  - Direct commits to `main` are disabled. All changes must be merged via pull requests.
  - At least two code reviews are required before merging.
  - CI checks must pass before a PR can be merged.
  - Ensure the branch is up-to-date with `main` before merging.

- **Develop Branch:**
  - Similar protection rules as `main`.
  - All CI checks must pass before merging.

### **2. Merging Strategy**
- **Feature/Bugfix Branches:**
  - Merge feature and bugfix branches into `develop` via pull requests.
  - Rebase onto `develop` if necessary to keep the history clean.

- **Release Branches:**
  - Merge release branches into both `main` and `develop`.
  - Tag the `main` branch with the release version (e.g., `v1.0.0`).

- **Hotfix Branches:**
  - Merge hotfix branches into `main` immediately after verification.
  - Also merge the hotfix into `develop` to keep both branches aligned.

## **Automation and CI/CD Integration**

### **1. Pre-Commit Hooks**
- **Husky:** We use Husky to enforce pre-commit hooks, running linting and tests before allowing commits. This ensures that only clean code enters the branches.

### **2. Continuous Integration**
- **CI Pipelines:** Integrated with CI tools like GitHub Actions to automatically test and build branches when pull requests are opened.
- **Automated Checks:** All pull requests must pass unit tests, integration tests, and security scans before being merged.

### **3. Branch Deletion**
- **After Merging:** Feature, bugfix, and hotfix branches are automatically deleted after they are merged to keep the repository clean.
