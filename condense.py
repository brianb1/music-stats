#!/usr/bin/python

mod = 4
numFile = open("justNums.txt")

total = 0
i = 0
for line in numFile:
    num = int(line)
    total += num
    if i % mod == 0:
        print(int(total / mod))
        total = 0
    i += 1
