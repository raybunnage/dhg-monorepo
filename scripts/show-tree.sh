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
        # Hooks
        if [ -d "$app_path/src/hooks" ]; then
            print_color $GREEN "│   ├── hooks"
            find "$app_path/src/hooks" -name "*.ts" | sed 's|.*/||' | sed 's/^/│   │   ├── /'
        fi
        # Context
        if [ -d "$app_path/src/context" ]; then
            print_color $GREEN "│   ├── context"
            find "$app_path/src/context" -name "*.ts" -o -name "*.tsx" | sed 's|.*/||' | sed 's/^/│   │   ├── /'
        fi
        # Root files in src
        find "$app_path/src" -maxdepth 1 -type f \( -name "*.tsx" -o -name "*.ts" \) | sed 's|.*/||' | sed 's/^/│   ├── /'
    fi
    
    # Show config files
    print_color $BLUE "\n├── config files"
    find "$app_path" -maxdepth 1 -type f \( -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.config.*" \) | sed 's|.*/||' | sed 's/^/│   ├── /'
}

# Function to show backend structure
show_backend() {
    print_color $YELLOW "\n🔧 backend"
    
    # Show scripts
    if [ -d "backend/scripts" ]; then
        print_color $BLUE "├── scripts"
        find "backend/scripts" -type f -name "*.sh" | sed 's|.*/||' | sort | sed 's/^/│   ├── /'
    fi
    
    # Show core
    if [ -d "backend/core" ]; then
        print_color $BLUE "├── core"
        find "backend/core" -type f -name "*.py" | sed 's|.*/||' | sort | sed 's/^/│   ├── /'
    fi
    
    # Show services with more detail
    if [ -d "backend/services" ]; then
        print_color $BLUE "├── services"
        for service_dir in backend/services/*; do
            if [ -d "$service_dir" ]; then
                local service_name=$(basename "$service_dir")
                print_color $GREEN "│   ├── $service_name"
                
                # Show service structure
                # Models
                if [ -d "$service_dir/models" ]; then
                    print_color $BLUE "│   │   ├── models"
                    find "$service_dir/models" -type f -name "*.py" | sed 's|.*/||' | sort | sed 's/^/│   │   │   ├── /'
                fi
                
                # Routes
                if [ -d "$service_dir/routes" ]; then
                    print_color $BLUE "│   │   ├── routes"
                    find "$service_dir/routes" -type f -name "*.py" | sed 's|.*/||' | sort | sed 's/^/│   │   │   ├── /'
                fi
                
                # Utils
                if [ -d "$service_dir/utils" ]; then
                    print_color $BLUE "│   │   ├── utils"
                    find "$service_dir/utils" -type f -name "*.py" | sed 's|.*/||' | sort | sed 's/^/│   │   │   ├── /'
                fi
                
                # Tests
                if [ -d "$service_dir/tests" ]; then
                    print_color $BLUE "│   │   ├── tests"
                    find "$service_dir/tests" -type f -name "test_*.py" | sed 's|.*/||' | sort | sed 's/^/│   │   │   ├── /'
                fi
                
                # Root service files
                find "$service_dir" -maxdepth 1 -type f -name "*.py" | sed 's|.*/||' | sort | sed 's/^/│   │   ├── /'
            fi
        done
    fi
    
    # Show config and requirements
    print_color $BLUE "├── config"
    echo "│   ├── requirements/"
    if [ -f "backend/requirements.txt" ]; then
        echo "│   │   ├── requirements.txt"
    fi
    if [ -f "backend/requirements.frozen.txt" ]; then
        echo "│   │   ├── requirements.frozen.txt"
    fi
    if [ -f "backend/requirements.dev.txt" ]; then
        echo "│   │   ├── requirements.dev.txt"
    fi
    
    # Show environment files
    print_color $BLUE "├── environment"
    if [ -f "backend/.env" ]; then
        echo "│   ├── .env"
    fi
    if [ -f "backend/.env.example" ]; then
        echo "│   ├── .env.example"
    fi
    
    # Show other root files
    print_color $BLUE "├── root files"
    find "backend" -maxdepth 1 -type f \( -name "*.py" -o -name "*.md" \) | sed 's|.*/||' | sort | sed 's/^/│   ├── /'
}

# Main execution
print_color $YELLOW "🌳 DHG Monorepo Structure"
print_color $YELLOW "========================="

# Show root scripts
if [ -d "scripts" ]; then
    print_color $YELLOW "\n📜 Root Scripts"
    find "scripts" -type f -name "*.sh" | sed 's|.*/||' | sort | sed 's/^/├── /'
fi

# Show apps
print_color $YELLOW "\n📱 apps"
for app_dir in apps/*; do
    if [ -d "$app_dir" ]; then
        show_app_tree "$app_dir"
    fi
done

# Show backend
show_backend

# Show root config files
print_color $YELLOW "\n⚙️  Root Config Files"
find . -maxdepth 1 -type f \( -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.yaml" -o -name "*.config.*" \) | sed 's|.*/||' | sed 's/^/├── /'

echo -e "\n" 