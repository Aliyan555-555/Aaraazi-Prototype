#!/bin/bash
# Script to copy Enhanced version to main file with name changes

# Copy the enhanced file to the main file
cp /components/contacts/ContactDetailsV4Enhanced.tsx /components/contacts/ContactDetailsV4.tsx

# Replace all instances of ContactDetailsV4Enhanced with ContactDetailsV4
sed -i 's/ContactDetailsV4Enhanced/ContactDetailsV4/g' /components/contacts/ContactDetailsV4.tsx

# Update the module name in the header comment
sed -i 's/@module ContactDetailsV4/@module ContactDetailsV4/g' /components/contacts/ContactDetailsV4.tsx

echo "Contact Details file updated successfully!"
