# encoding= utf-8
from datetime import datetime
import csv
import random
import math
import pygame  # draw point
import numpy as np
from scipy import stats
import copy


def readData(w2v_file):
    station_data = []
    fo1 = open(w2v_file, 'r', encoding="utf-8")
    for line in fo1.readlines():
        term = line.strip().split(' ')
        station_data.append([float(term[0]), float(term[1])])
    v1 = [x[0] for x in station_data]
    v2 = [x[1] for x in station_data]
    max1 = max(v1)
    min1 = min(v1)
    max2 = max(v2)
    min2 = min(v2)
    nor1 = max1 - min1
    nor2 = max2 - min2
    index = 0
    for item in station_data:
        x = item[0]
        y = item[1]
        station_data[index].append((x - min1) / nor1)
        station_data[index].append((y - min2) / nor2)
        station_data[index].append(0)
        index += 1
    # print("station_data", station_data)
    return station_data


def distance(p1, p2):
    p_diff = (p2[0] - p1[0], p2[1] - p1[1])
    return math.sqrt(math.pow(p_diff[0], 2) + math.pow(p_diff[1], 2))


def is_in_circle(p):
    # d = distance(p, (0, 0))
    if (p[0] < 1 and p[0] > 0 and p[1] < 1 and p[1] > 0):
        return True
    else:
        return False


def generate_random_point(o, r, dataset):
    # Generate random point form dataset
    i = int(random.random() * len(dataset))
    ix = dataset[i][2]
    iy = dataset[i][3]
    return [ix, iy]


def kde_fun(data):
    data1 = []
    for item in data:
        data1.append([item[2], item[3]])
    data1 = np.array(data1)
    values = data1.T
    kde = stats.gaussian_kde(values)
    return kde


def generate_points(kde_function, dataset, oriset, radius):
    out_index = []
    samples = []
    samples_index = []
    active_list = []
    #     for i in range(0,4500):
    #         samples.append([dataset[i][2],dataset[i][3]])
    len_s = len(dataset)
    # Choose a point randomly in the domain.
    i = int(random.random() * len_s)
    out_index.append(i)
    ix = dataset[i][2]
    iy = dataset[i][3]
    initial_point = [ix, iy]
    samples.append(initial_point)
    del (dataset[i])
    # remove the adj of initial point
    minimum_dist = float(kde_function(np.array(initial_point)))
    print("minimum_dist", minimum_dist)
    minimum_dist = radius * 1 / (minimum_dist * 1000)
    print("minimum_dist", minimum_dist)

    index = 0
    points = []
    while (index < len(dataset)):
        ix = dataset[index][2]
        iy = dataset[index][3]
        if (distance(initial_point, [ix, iy]) < minimum_dist):
            points.append([ix, iy])
            del (dataset[index])
        index += 1
    samples_index.append(points)

    active_list.append(initial_point)
    while len(active_list) > 0:
        # Choose a random point from the active list.
        p_index = random.randint(0, len(active_list) - 1)
        random_p = active_list[p_index]
        print("active_list: ", len(active_list))
        print("dataset: ", len(dataset))
        found = False
        # Generate up to k points chosen uniformly at random from dataset
        k = 30
        for it in range(k):
            # print(float(kde_function(np.array(samples[0]))))
            minimum_dist = float(kde_function(np.array(random_p)))
            minimum_dist = radius * 1 / (minimum_dist * 1000)
            index_i = int(random.random() * len(dataset))
            ix_h = dataset[index_i][2]
            iy_h = dataset[index_i][3]
            pn = [ix_h, iy_h]
            fits = True
            # TODO: Optimize.  Maintain a grid of existing samples, and only check viable nearest neighbors.
            for point in samples:
                if distance(point, pn) < minimum_dist:
                    fits = False
                    break
            if fits:
                out_index.append(index_i)
                samples.append(pn)
                active_list.append(pn)
                index = 0
                points = []
                while (index < len(dataset)):
                    ix = dataset[index][2]
                    iy = dataset[index][3]
                    if (distance(pn, [ix, iy]) < minimum_dist):
                        points.append([ix, iy])
                        del (dataset[index])
                    index += 1
                samples_index.append(points)
                found = True
                #print(str(len(samples)) + " :" + str(len(dataset)) + "-" + str(minimum_dist))
                break

        if not found:
            active_list.remove(random_p)
            #print(len(active_list))
    # Print the samples in a form that can be copy-pasted into other code.
    # print("There are %d samples:" % len(samples))
    # for point in samples:
    #    print("\t{%08f,\t%08f}," % (point[0], point[1]))

    return out_index, samples, samples_index




# ---------main program--------
# init data file
def fun(seq, pds_r):
    w_size = 200
    w_fre = 10

    # name_file = ori_file + '_name.txt'
    pos_file = 'loc.txt'
    # coverage_file = ori_file + '_coverage.txt'
    # ebt_file = ori_file + '_ebt.txt'
    # id2com_file = 'WZ_Com_18.csv'
    f= open("id_lat&lng.csv", 'r', encoding='utf-8')
    id_data = csv.reader(f)
    index = 0
    id_arr = []
    for row in id_data:
        if index > 0:
            id_arr.append(row[0])
        index += 1
    print(id_arr)
    # max_iteration = 100
    seq_type = ''
    for t in seq:
        seq_type += str(t) + '_'
    seq_type = seq_type[0:-1]
    print(seq_type)
    # sam_file = 'pds/basestation_w2v' + str(w_size) + str(w_fre) + '2D_MCpds' + str(pds_r) + '_' + seq_type

    # samples_pos_file = sam_file + '.txt'
    # samples_name_file = sam_file + '_name.txt'
    # samples_label_file = sam_file + '_label.txt'

    # read points
    # start = datetime.now()
    station_data = readData(pos_file)
    # kde for adptive sampling
    kde = kde_fun(station_data)
    # sampling
    gene_data = copy.deepcopy(station_data)
    index_arr, samples, samples_index = generate_points(kde, gene_data, station_data, pds_r)
    out_arr = []
    print(len(index_arr))
    tmp_index = 0
    for arr in station_data:
        out_arr.append([id_arr[tmp_index], arr[0], arr[1], 0])
        tmp_index += 1
    for index in index_arr:
        out_arr[index][-1] = 1
    outfile = open("sample_50.csv", 'w', newline='')
    fw = csv.writer(outfile)
    fw.writerow(['lng', 'lat', 'status'])
    fw.writerows(out_arr)
    outfile.close()

    #多目标蓝噪声采样
    # add_coverage_attr(station_data, coverage_file)
    # add_ebt_attr(station_data, ebt_file)
    # add_com_attr(station_data, name_file, id2com_file)
    #
    # labelData(samples, samples_index, station_data)
    #
    # filename = "record_" + str(pds_r) + '_' + seq_type + '.csv'
    # outfile = open(filename, 'w', newline='')
    # ite_op(samples, samples_index, station_data, seq, max_iteration, outfile)
    #
    # # write data
    # print('number of samplers', len(samples))
    # generate_data(samples, station_data, name_file, samples_pos_file, samples_name_file)
    # samples_label(id2com_file, samples_name_file, samples_label_file)
    # print("end!")
    # display
    # display(samples)
attr_cbt = [[0, 1, 2]]
pdsR_arr = [3, 5, 10, 15]
fun([0], 18)
