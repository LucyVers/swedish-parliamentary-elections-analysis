#!/usr/bin/env python3
import csv

# Definiera mappningar för kommunnamn som behöver ändras
name_mappings = {
    'DalsEd': 'Dals-Ed',
    'Habo': 'Håbo',
    'MalungSalen': 'Malung-Sälen',
    'UpplandssBro': 'Upplands-Bro'
}

# Läs in original CSV-filen
rows = []
with open('data/education_data/education_by_municipality_2024.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file, delimiter=';')
    header = next(reader)  # Spara header
    for row in reader:
        # Kolla om kommunnamnet behöver uppdateras
        if row[1] in name_mappings:
            row[1] = name_mappings[row[1]]  # Uppdatera kommunnamnet
            # Uppdatera även det normaliserade namnet
            row[-1] = row[1].lower().replace('å', 'a').replace('ä', 'a').replace('ö', 'o').replace('-', '')
        rows.append(row)

# Skriv till en ny fil
with open('data/education_data/education_by_municipality_2024.updated.csv', 'w', encoding='utf-8', newline='') as file:
    writer = csv.writer(file, delimiter=';')
    writer.writerow(header)
    writer.writerows(rows)

print("CSV-fil uppdaterad och sparad som 'education_by_municipality_2024.updated.csv'")
print("Kontrollera den nya filen innan du ersätter originalet.") 