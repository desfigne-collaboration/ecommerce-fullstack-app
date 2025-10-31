# Image File Naming Standardization

## Overview

Date: 2025-10-31

This document describes the standardization of image file names across the entire ecommerce-fullstack-app repository. All image files have been systematically renamed to follow English naming conventions with consistent kebab-case formatting.

## Summary

- **Total images found**: 552 files
- **Files renamed**: 75 files
- **Affected directories**:
  - Documentation images
  - Brand icons and images
  - Product category images

## Naming Convention

### Standard Format
- Use **kebab-case** (lowercase with hyphens) for all file names
- Example: `brand_구호` → `brand_kuho`
- Example: `cmdImage01.PNG` → `cmd-image-01.png`

### File Extensions
- Standardized to lowercase: `.PNG` → `.png`
- Preserved original format types: `.webp`, `.svg`, `.png`, `.ico`

## Changes by Category

### 1. Documentation Images (16 files)

Located in: `docs/assets/images/setup/`

| Original Name | New Name | Description |
|--------------|----------|-------------|
| `cmdImage01.PNG` | `cmd-image-01.png` | Command line screenshot 01 |
| `cmdImage02.PNG` | `cmd-image-02.png` | Command line screenshot 02 |
| `featureBranch.PNG` | `feature-branch.png` | Feature branch creation |
| `myFeatureBranch.PNG` | `my-feature-branch.png` | My feature branch example |
| `pullRequest.PNG` | `pull-request.png` | Pull request screenshot |

### 2. Brand Images (138 files)

Located in:
- `frontend/public/icons/`
- `frontend/public/images/brands/`
- `frontend/src/assets/brands/`

Korean brand names were transliterated to English equivalents:

| Korean | English | Example |
|--------|---------|---------|
| 갤럭시 | galaxy | `brand_갤럭시.webp` → `brand_galaxy.webp` |
| 갤럭시라이프스타일 | galaxy-lifestyle | `brand_갤럭시라이프스타일.webp` → `brand_galaxy-lifestyle.webp` |
| 구호 | kuho | `brand_구호.webp` → `brand_kuho.webp` |
| 구호플러스 | kuho-plus | `brand_구호플러스.webp` → `brand_kuho-plus.webp` |
| 꼼데가르송 | comme-des-garcons | `brand_꼼데가르송.webp` → `brand_comme-des-garcons.webp` |
| 디애퍼처 | departure | `brand_디애퍼처.webp` → `brand_departure.webp` |
| 랙앤본 | rag-and-bone | `brand_랙앤본.webp` → `brand_rag-and-bone.webp` |
| 로가디스 | rogatis | `brand_로가디스.webp` → `brand_rogatis.webp` |
| 르무통 | le-mouton | `brand_르무통.webp` → `brand_le-mouton.webp` |
| 메종키츠네 | maison-kitsune | `brand_메종키츠네.webp` → `brand_maison-kitsune.webp` |
| 비이커 | beaker | `brand_비이커.webp` → `brand_beaker.webp` |
| 빈폴 | beanpole | `brand_빈폴.webp` → `brand_beanpole.webp` |
| 샌드사운드 | sand-sound | `brand_샌드사운드.webp` → `brand_sand-sound.webp` |
| 세인트제임스 | saint-james | `brand_세인트제임스.webp` → `brand_saint-james.webp` |
| 스포티앤리치 | sporty-and-rich | `brand_스포티앤리치.webp` → `brand_sporty-and-rich.webp` |
| 시에 | cie | `brand_시에.webp` → `brand_cie.webp` |
| 에잇세컨즈 | eight-seconds | `brand_에잇세컨즈.webp` → `brand_eight-seconds.webp` |
| 이뉴골프 | inew-golf | `brand_이뉴골프.webp` → `brand_inew-golf.webp` |
| 이세이미야케 | issey-miyake | `brand_이세이미야케.webp` → `brand_issey-miyake.webp` |
| 제너럴 아이디어 | general-idea | `brand_제너럴 아이디어.webp` → `brand_general-idea.webp` |
| 캐나다구스 | canada-goose | `brand_캐나다구스.webp` → `brand_canada-goose.webp` |
| 코스 | cos | `brand_코스.webp` → `brand_cos.webp` |
| 텐꼬르소꼬모 | ten-corso-como | `brand_텐꼬르소꼬모.webp` → `brand_ten-corso-como.webp` |
| 띠어리 | theory | `brand_띠어리.webp` → `brand_theory.webp` |
| 파타고니아 | patagonia | `brand_파타고니아.webp` → `brand_patagonia.webp` |
| 헤라 | hera | `brand_헤라.webp` → `brand_hera.webp` |

### 3. Product Category Images

#### Beauty (24 files)
- Location: `frontend/public/images/beauty/`
- Already following English naming convention
- Format: `beauty_[category][number].webp`
- Categories: makeup, new, perfume, skin

#### Golf (24 files)
- Location: `frontend/public/images/golf/`
- Already following English naming convention
- Format: `golf_[category][number].webp`
- Categories: men, new, women

#### Lifestyle (30 files)
- Location: `frontend/public/images/life/`
- Already following English naming convention
- Format: `life_[category][number].webp`
- Categories: living, new

#### Outdoor (6 files)
- Location: `frontend/public/images/outdoor/`
- Already following English naming convention
- Format: `outdoor_[category][number].webp`

#### Sports (multiple files)
- Location: `frontend/public/images/sport/`
- Already following English naming convention
- Format: `sport_[category][number].webp`

### 4. Icons (63 files)

Located in: `frontend/public/icons/`

- Brand icons: Renamed following brand name mapping (see section 2)
- Social login icons: `google.svg`, `naver.svg` (unchanged)
- Main carousel images: `main1.webp` ~ `main9.webp` (unchanged)

## Files Not Changed

The following files were kept as-is because they already follow proper naming conventions:

1. **System files**:
   - `favicon.ico`
   - `logo.svg`

2. **Social login icons**:
   - `google.svg`
   - `naver.svg`

3. **Product category images**:
   - All images in `beauty/`, `golf/`, `life/`, `outdoor/`, `sport/` directories
   - Already using English names with proper formatting

4. **Main carousel images**:
   - `main1.webp` through `main9.webp`

## Documentation Updates

The following documentation files were updated to reflect new image names:

- [docs/03-development/setup/git-strategy.md](../03-development/setup/git-strategy.md)
  - `cmdImage01.PNG` → `cmd-image-01.png`
  - `cmdImage02.PNG` → `cmd-image-02.png`
  - `featureBranch.PNG` → `feature-branch.png`
  - `myFeatureBranch.PNG` → `my-feature-branch.png`
  - `pullRequest.PNG` → `pull-request.png`

## Benefits

1. **Consistency**: All image files now follow a uniform naming convention
2. **Internationalization**: English names are universally accessible
3. **Developer Experience**: Easier to reference and search for images
4. **Maintainability**: Clear, predictable file naming structure
5. **Cross-platform Compatibility**: Lowercase extensions avoid case-sensitivity issues

## Technical Details

### Tools Used
- Python script: `rename_images.py`
- Automatic file detection and systematic renaming
- JSON mapping file generated for reference: `image_rename_mapping.json`

### Verification
- All renamed files were verified to exist in their new locations
- Documentation references were updated accordingly
- No duplicate file names were created

## Future Recommendations

1. Maintain kebab-case naming for all new image files
2. Use English names for all new brand additions
3. Follow the pattern: `[category]_[subcategory]-[name].[ext]`
4. Keep file extensions lowercase
5. Update this document when adding new image categories

## Related Files

- Script: [rename_images.py](../../rename_images.py)
- Mapping: [image_rename_mapping.json](../../image_rename_mapping.json)
- Summary: [image_rename_summary.json](../../image_rename_summary.json)
