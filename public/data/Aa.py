import csv

f = open("id_lat&lng.csv", 'r', encoding='utf-8')
outfile = open("loc.txt", 'w')
loc_data = csv.reader(f)
index = 0

for row in loc_data:
    if index > 0:
        tmp_line = row[2] + ' ' + row[1] + '\n'
        outfile.write(tmp_line)
    index += 1
outfile.close()