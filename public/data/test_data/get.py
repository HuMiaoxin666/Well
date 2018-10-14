import csv
file = open("place.csv", 'r')
data = csv.reader(file)
outfile = open("test.txt", 'w')
index = 0
for row in data:
    if index < 1000 and index > 0:
        outfile.write(row[1]+' '+row[2]+'\n')
    index += 1
outfile.close()
