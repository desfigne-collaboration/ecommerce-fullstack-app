#!/bin/bash
# Bash script to convert useHistory to useNavigate in React Router v7

cd "c:/dev/ecommerce-fullstack-app/frontend/src"

# Find all .jsx and .js files containing useHistory
files=$(grep -rl "useHistory" --include="*.jsx" --include="*.js" pages 2>/dev/null)

converted=0
total=0

for file in $files; do
    total=$((total + 1))
    echo "Processing: $file"

    # Create backup
    cp "$file" "${file}.bak"

    # 1. Replace import statement
    sed -i 's/import { \([^}]*\)useHistory\([^}]*\) } from "react-router-dom"/import { \1useNavigate\2 } from "react-router-dom"/g' "$file"
    sed -i "s/import { \([^}]*\)useHistory\([^}]*\) } from 'react-router-dom'/import { \1useNavigate\2 } from 'react-router-dom'/g" "$file"

    # 2. Replace hook declaration
    sed -i 's/const history = useHistory()/const navigate = useNavigate()/g' "$file"

    # 3. Replace simple push calls
    sed -i 's/history\.push(\([^)]*\))/navigate(\1)/g' "$file"

    # 4. Replace replace calls
    sed -i 's/history\.replace(/navigate(/g' "$file"

    # 5. Replace goBack
    sed -i 's/history\.goBack()/navigate(-1)/g' "$file"

    # 6. Update dependencies in useEffect
    sed -i 's/\[history\]/[navigate]/g' "$file"
    sed -i 's/\[history,/[navigate,/g' "$file"
    sed -i 's/, history\]/, navigate]/g' "$file"
    sed -i 's/, history,/, navigate,/g' "$file"

    # Check if file was modified
    if ! diff -q "$file" "${file}.bak" > /dev/null 2>&1; then
        echo "  ✓ Converted"
        converted=$((converted + 1))
        rm "${file}.bak"
    else
        echo "  - No changes"
        mv "${file}.bak" "$file"
    fi
done

echo ""
echo "Conversion complete!"
echo "Files converted: $converted / $total"
