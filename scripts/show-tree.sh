#!/bin/bash

# Colors for better visualization
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print with color
print_color() {
    local color=$1
    local text=$2
    echo -e "${color}${text}${NC}"
}

# Function to show tree structure for a specific app
show_app_tree() {
    local app_path=$1
    local app_name=$(basename "$app_path")
    
    print_color $YELLOW "\n📁 $app_name"
    
    # Show source files
    if [ -d "$app_path/src" ]; then
        print_color $BLUE "\n├── src"
        # Components
        if [ -d "$app_path/src/components" ]; then
            print_color $GREEN "│   ├── components"
            find "$app_path/src/components" -name "*.tsx" -o -name "*.ts" | sed 's|.*/||' | sed 's/^/│   │   ├── /'
        fi
        # Pages
        if [ -d "$app_path/src/pages" ]; then
            print_color $GREEN "│   ├── pages"
            find "$app_path/src/pages" -name "*.tsx" -o -name "*.ts" | sed 's|.*/||' | sed 's/^/│   │   ├── /'
        fi
        # Utils
        if [ -d "$app_path/src/utils" ]; then
            print_color $GREEN "│   ├── utils"
            find "$app_path/src/utils" -name "*.ts" | sed 's|.*/||' | sed 's/^/│   │   ├── /'
        fi
        # Types
        if [ -d "$app_path/src/types" ]; then
            print_color $GREEN "│   ├── types"
            find "$app_path/src/types" -name "*.ts" | sed 's|.*/||' | sed 's/^/│   │   ├── /'
        fi
        # Root files in src
        find "$app_path/src" -maxdepth 1 -type f \( -name "*.tsx" -o -name "*.ts" \) | sed 's|.*/||' | sed 's/^/│   ├── /'
    fi
    
    # Show config files
    print_color $BLUE "\n├── config files"
    find "$app_path" -maxdepth 1 -type f \( -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.config.*" \) | sed 's|.*/||' | sed 's/^/│   ├── /'
}

# Function to show shared packages
show_packages() {
    print_color $YELLOW "\n📦 packages"
    
    # List all packages
    for package_dir in packages/*; do
        if [ -d "$package_dir" ]; then
            local package_name=$(basename "$package_dir")
            print_color $BLUE "\n├── $package_name"
            
            # Show source files
            if [ -d "$package_dir/src" ]; then
                print_color $GREEN "│   ├── src"
                find "$package_dir/src" -type f \( -name "*.tsx" -o -name "*.ts" \) | sed 's|.*/||' | sed 's/^/│   │   ├── /'
            fi
            
            # Show config files
            print_color $GREEN "│   ├── config"
            find "$package_dir" -maxdepth 1 -type f \( -name "*.json" -o -name "*.js" -o -name "*.ts" \) | sed 's|.*/||' | sed 's/^/│   │   ├── /'
        fi
    done
}

# Main execution
print_color $YELLOW "🌳 DHG Monorepo Structure"
print_color $YELLOW "========================="

# Show apps
print_color $YELLOW "\n📱 apps"
for app_dir in apps/*; do
    if [ -d "$app_dir" ]; then
        show_app_tree "$app_dir"
    fi
done

# Show packages
show_packages

# Show root config files
print_color $YELLOW "\n⚙️  Root Config Files"
find . -maxdepth 1 -type f \( -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.yaml" -o -name "*.config.*" \) | sed 's|.*/||' | sed 's/^/├── /'

echo -e "\n" 