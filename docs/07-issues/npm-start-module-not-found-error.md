# npm start Module Not Found Error - Troubleshooting Guide

**Document Version:** 1.0
**Date:** 2025-10-31
**Issue Type:** Build Error
**Status:** Resolved

## Issue Summary

When running `npm start` in the frontend directory, developers encounter multiple "Module not found" errors for brand image files in `src/assets/brands/`.

## Error Messages

```
ERROR in ./src/pages/home/Home.jsx 11:0-73
Module not found: Error: Can't resolve 'https://desfigne.synology.me/data/image/thejoeun/icons/brand_eight-seconds.webp' in 'C:\dev\ecommerce-fullstack-app\frontend\src\pages\home'

ERROR in ./src/pages/home/Home.jsx 12:0-68
Module not found: Error: Can't resolve 'https://desfigne.synology.me/data/image/thejoeun/icons/brand_beanpole.webp' in 'C:\dev\ecommerce-fullstack-app\frontend\src\pages\home'

[... 21 more similar errors for other brand files]
```

## Root Cause Analysis

### Primary Issues Identified

1. **Outdated Local Repository**
   - Developer's local branch was behind the remote repository
   - Brand image files were renamed from Korean to English in commit `637108a`
   - Missing the latest changes that added English-named brand files

2. **Duplicate Korean-Named Files**
   - Three Korean-named files remained in the repository:
     - `brand_갤럭시라이프스타일.webp`
     - `brand_단톤.webp`
     - `brand_토리버치.webp`
   - These conflicted with the English equivalents

3. **Potential Node Module Cache Issues**
   - Webpack might have cached old file references
   - `node_modules` could be out of sync with package updates

## Solution

### Step 1: Update Local Repository

```bash
# Switch to develop branch
git checkout develop

# Pull latest changes from remote
git pull origin develop

# If you have local uncommitted changes, stash them first:
git stash
git pull origin develop
git stash pop
```

### Step 2: Clean Node Modules and Cache

```bash
# Navigate to frontend directory
cd frontend

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache (optional but recommended)
npm cache clean --force

# Reinstall dependencies
npm install
```

### Step 3: Verify Brand Files Exist

Check that all English-named brand files are present:

```bash
ls src/assets/brands/brand_*.webp | wc -l
# Should show 35 files (after removing 3 Korean-named duplicates)
```

Expected files:
- brand_eight-seconds.webp
- brand_beanpole.webp
- brand_beaker.webp
- brand_kuho.webp
- brand_issey-miyake.webp
- brand_maison-kitsune.webp
- brand_theory.webp
- brand_kuho-plus.webp
- brand_comme-des-garcons.webp
- brand_patagonia.webp
- brand_sporty-and-rich.webp
- brand_cie.webp
- brand_inew-golf.webp
- brand_general-idea.webp
- brand_le-mouton.webp
- brand_ami.webp
- brand_juunj.webp
- brand_rogatis.webp
- brand_danton.webp
- brand_ten-corso-como.webp
- brand_departure.webp
- brand_cos.webp
- brand_saint-james.webp
- brand_tommy-hilfiger.webp
- brand_canada-goose.webp
- brand_hera.webp
- brand_galaxy-lifestyle.webp
- brand_rebaige.webp
- brand_tory-burch.webp
- brand_galaxy.webp
- brand_lemaire.webp
- brand_fitflop.webp
- brand_ganni.webp
- brand_rag-and-bone.webp
- brand_sand-sound.webp

### Step 4: Start Development Server

```bash
npm start
```

The application should now start successfully without module errors.

## Changes Made in This Fix

### Repository Updates

1. **Removed Duplicate Korean-Named Files** (Commit: TBD)
   - Deleted `brand_갤럭시라이프스타일.webp` (duplicate of `brand_galaxy-lifestyle.webp`)
   - Deleted `brand_단톤.webp` (duplicate of `brand_danton.webp`)
   - Deleted `brand_토리버치.webp` (duplicate of `brand_tory-burch.webp`)

2. **Documentation Created**
   - Added this troubleshooting guide to `docs/07-issues/`
   - Provides step-by-step resolution for future occurrences

### File Structure After Fix

```
frontend/
├── src/
│   └── assets/
│       └── brands/
│           ├── brand_eight-seconds.webp
│           ├── brand_beanpole.webp
│           ├── ... (35 English-named files total)
│           └── banner/
│               └── [brand subdirectories]
└── public/
    └── icons/
        └── [additional brand icons]
```

## Prevention Guidelines

### For Developers

1. **Always Pull Before Starting Work**
   ```bash
   git pull origin develop
   ```

2. **Check for Breaking Changes**
   - Review recent commits before starting development
   - Pay attention to file rename/move operations

3. **Clean Build When Switching Branches**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Verify Build Locally Before Committing**
   ```bash
   npm start    # Verify no errors
   npm run build    # Verify production build works
   ```

### For Team Leads

1. **Communicate File Structure Changes**
   - Notify team when files are renamed/moved
   - Update documentation immediately after structural changes

2. **Use Proper Git Workflows**
   - File renames should be done via `git mv` when possible
   - Keep commits focused and well-documented

3. **Maintain Clean Repository**
   - Remove old/duplicate files promptly
   - Run periodic audits for naming consistency

## Related Documentation

- [Image File Standardization](../06-changelog/image-file-standardization.md)
- [Git Strategy](../03-development/setup/git-strategy.md)
- [Frontend Setup](../03-development/frontend/authentication/README.md)

## Troubleshooting Checklist

If you encounter this error, work through this checklist:

- [ ] Run `git status` to check current branch and uncommitted changes
- [ ] Run `git pull origin develop` to get latest changes
- [ ] Verify brand files exist: `ls src/assets/brands/brand_*.webp`
- [ ] Delete `node_modules` and `package-lock.json`
- [ ] Run `npm install` to reinstall dependencies
- [ ] Clear webpack cache: `rm -rf node_modules/.cache`
- [ ] Restart development server: `npm start`
- [ ] If still failing, check console for specific missing files
- [ ] Verify `Home.jsx` import statements match actual filenames

## Additional Notes

### Windows-Specific Considerations

On Windows, file path case sensitivity can cause issues:
- Git treats filenames as case-sensitive
- Windows filesystem is case-insensitive
- Ensure exact filename matching including hyphens and case

### Webpack Module Resolution

Webpack resolves modules in this order:
1. Exact match in filesystem
2. Checks webpack aliases (e.g., `@/` for `src/`)
3. Checks `node_modules`

For static assets like images:
- Path must be relative to the importing file
- File must exist at build time
- Webpack uses `file-loader` or `url-loader` for images

## Success Criteria

After applying the fix:
- ✅ `npm start` runs without "Module not found" errors
- ✅ All 35 brand images load correctly on Home page
- ✅ No Korean-named duplicate files exist
- ✅ Build completes successfully: `npm run build`
- ✅ Development server hot-reloads properly

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-31 | Claude Code | Initial documentation of npm start error fix |

---

**Last Updated:** 2025-10-31
**Maintained By:** Development Team
**Category:** Troubleshooting / Build Issues
