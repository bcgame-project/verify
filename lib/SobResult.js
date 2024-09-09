const base_csv = `1,3,4,3,2,3
2,7,2,9,7,8
3,10,9,10,11,6
4,9,8,9,8,9
5,7,10,4,9,10
6,8,8,8,3,2
7,10,9,7,8,10
8,6,11,10,10,9
9,9,5,2,11,7
10,8,9,13,6,1
11,4,8,13,8,10
12,10,10,13,9,5
13,8,8,1,3,7
14,9,5,8,10,10
15,10,10,10,1,12
16,8,13,9,8,8
17,2,13,11,7,10
18,10,13,9,9,9
19,7,13,10,2,13
20,5,7,8,6,13
21,10,5,10,10,13
22,3,4,12,3,9
23,8,7,9,9,10
24,7,6,1,8,8
25,12,10,8,4,12
26,6,5,10,13,9
27,10,6,1,13,2
28,2,10,9,13,10
29,9,1,8,13,1
30,7,10,12,9,10
31,8,11,3,3,9
32,10,7,9,7,7
33,12,10,7,10,12
34,7,4,12,1,1
35,8,9,3,10,10
36,9,11,8,11,8
37,10,6,11,9,9
38,8,9,6,2,13
39,6,1,13,7,13
40,12,6,13,3,13
41,7,8,13,1,9
42,10,10,9,9,6
43,8,3,11,8,6
44,9,2,2,10,2
45,3,10,3,11,12
46,5,7,10,9,3
47,1,11,5,1,10
48,7,6,7,4,4
49,12,5,2,5,9
50,9,13,5,3,7
51,8,13,9,10,1
52,1,13,8,8,10
53,7,13,7,4,4
54,5,1,12,5,12
55,10,8,10,9,5
56,9,9,4,2,8
57,4,10,9,10,3
58,9,4,11,3,10
59,10,3,4,9,4
60,7,5,5,8,10
61,5,10,8,4,0
62,10,9,9,13,0
63,12,11,6,13,0
64,9,8,1,13,0
65,6,9,13,13,0
66,7,7,13,6,0
67,2,6,13,8,0
68,9,9,3,5,0
69,4,7,6,9,0
70,5,8,7,4,0
71,1,10,2,11,0
72,7,3,11,5,0
73,8,5,6,2,0
74,10,10,12,10,0
75,9,9,7,8,0
76,4,7,6,4,0
77,8,8,10,3,0
78,3,3,4,5,0
79,10,7,9,2,0
80,6,2,5,10,0
81,0,10,10,0,0
82,0,6,8,0,0
83,0,10,9,0,0
84,0,8,7,0,0
85,0,4,2,0,0
86,0,3,7,0,0
87,0,0,0,0,0
88,0,0,0,0,0
89,0,0,0,0,0
90,0,0,0,0,0
91,0,0,0,0,0
92,0,0,0,0,0
93,0,0,0,0,0
94,0,0,0,0,0
95,0,0,0,0,0
96,0,0,0,0,0
97,0,0,0,0,0
98,0,0,0,0,0
99,0,0,0,0,0
100,0,0,0,0,0
101,0,0,0,0,0
102,0,0,0,0,0
103,0,0,0,0,0
104,0,0,0,0,0
105,0,0,0,0,0
106,0,0,0,0,0`;

const free_csv = `1,3,4,3,2,3
2,6,2,9,7,8
3,4,9,10,11,6
4,2,3,9,8,4
5,7,10,4,5,10
6,5,4,8,3,2
7,10,9,7,4,13
8,6,11,6,10,13
9,4,5,2,11,13
10,8,9,13,6,1
11,4,3,13,8,10
12,10,10,13,5,5
13,4,6,1,3,6
14,9,5,8,10,5
15,1,7,5,1,8
16,8,13,6,4,3
17,2,13,11,7,10
18,9,13,9,5,4
19,4,13,10,2,7
20,5,7,4,6,2
21,10,3,10,10,9
22,3,4,6,5,4
23,4,7,9,2,13
24,6,6,1,8,13
25,9,5,8,4,13
26,6,4,5,13,9
27,10,6,1,13,2
28,2,10,5,13,10
29,9,1,8,13,1
30,4,10,6,9,5
31,5,11,3,3,4
32,1,7,9,7,7
33,7,8,7,10,9
34,5,4,4,1,1
35,1,3,5,10,10
36,9,11,8,11,8
37,4,6,11,9,4
38,8,9,6,2,7
39,6,1,7,7,1
40,9,6,10,3,10
41,6,2,3,1,4
42,10,3,9,9,6
43,2,5,11,4,13
44,9,2,2,10,13
45,4,8,3,11,13
46,5,7,8,5,3
47,1,11,6,1,10
48,7,6,7,4,4
49,9,5,2,13,9
50,4,13,5,13,7
51,5,13,1,13,1
52,1,13,8,13,10
53,7,13,7,4,4
54,5,10,6,5,6
55,1,6,10,9,5
56,9,1,4,2,8
57,4,8,9,10,3
58,4,4,11,5,10
59,2,3,4,2,4
60,7,5,5,8,3
61,5,6,8,4,0
62,10,9,9,13,0
63,6,11,6,13,0
64,9,8,1,13,0
65,6,9,13,13,0
66,10,2,13,6,0
67,2,6,13,8,0
68,9,9,8,5,0
69,4,7,6,3,0
70,5,8,7,4,0
71,1,4,2,11,0
72,7,13,11,5,0
73,5,13,6,2,0
74,1,13,8,10,0
75,9,13,7,8,0
76,4,7,6,4,0
77,8,8,10,7,0
78,9,1,4,5,0
79,10,7,9,2,0
80,6,2,5,10,0`;

const bonus_csv = `1,1,0,0
2,1,2,40
3,1,3,50
4,1,5,60
5,1,7,30
6,1,10,15
7,1,15,10
8,2,0,50
9,2,2,35
10,2,3,45
11,2,5,55
12,2,7,100
13,2,10,30
14,2,15,15
15,3,0,150
16,3,2,40
17,3,3,50
18,3,5,60
19,3,7,60
20,3,10,80
21,3,15,60
22,4,0,475
23,4,2,20
24,4,3,30
25,4,5,40
26,4,7,50
27,4,10,240
28,4,15,200`;

const lines_csv = `1,1,2,1,1,1
2,1,2,1,2,2
3,1,2,2,2,2
4,1,2,2,3,3
5,1,2,3,2,1
6,1,4,3,4,1
7,2,2,1,2,1
8,2,2,2,2,1
9,2,2,2,3,3
10,2,2,3,2,2
11,2,3,3,3,2
12,2,1,1,1,2
13,2,1,2,1,2
14,2,1,3,1,2
15,2,1,2,4,2
16,3,4,3,3,2
17,3,4,2,1,1
18,3,4,2,4,3
19,3,4,1,4,3
20,3,3,3,4,3
21,3,2,2,3,1
22,3,2,1,2,3
23,3,1,3,1,3
24,3,1,2,4,1
25,3,1,1,1,3`;



class SobResult {
  cowNums;
  baseData;
  freeData;
  linesData;
  bonusData;
  constructor() {
    this.cowNums = [3, 4, 3, 4, 3];
    this.baseData = this.formatDataByCSV(base_csv);
    this.freeData = this.formatDataByCSV(free_csv);
    this.linesData = this.formatLinesByCSV(lines_csv);
    this.bonusData = this.formatBonusByCSV(bonus_csv);
  }

  /**
   * 通过index获取表格
   * @param data 目标表
   * @param cowIndexs 索引列表
   */
  getDataByIndex(data, cowIndexs) {
    return this.cowNums.map((num, index) => {
      //cowIndex下标是1开始的
      const start = cowIndexs[index];
      const end = start + num;
      // 补齐end
      let dataCow = data[index].concat(data[index].slice(0, num));
      return dataCow.slice(start, end);
    });
  }

  getBaseDataByIndex(cowIndexs) {
    return this.getDataByIndex(this.baseData, cowIndexs);
  }

  getFreeDataByIndex(cowIndexs) {
    return this.getDataByIndex(this.freeData, cowIndexs);
  }

  /**
   * 格式化出来csv文件
   */
  formatCsv(csvData) {
    return (csvData)
      .split('\n')
      .map((it) => it.split(',').map((it) => Number(it)));
  }

  /**
   * 格式表数据
   */
  formatDataByCSV(csvData) {
    const currData = this.formatCsv(csvData);
    const data = [[], [], [], [], []];
    for (let row = 0, totalRow = currData.length; row < totalRow; row++) {
      for (let cow = 0; cow < 5; cow++) {
        let num = currData[row][cow + 1];
        if (num > 0) {
          data[cow].push(num);
        }
      }
    }
    return data;
  }

  /**
   * 格式化线数据
   * @param csvData
   */
  formatLinesByCSV(csvData) {
    const currData = this.formatCsv(csvData);
    const data = [];
    for (let n = 0, l = currData.length; n < l; n++) {
      data.push(currData[n].slice(1));
    }
    return data;
  }

  /**
   * 格式化bonus数据
   * @param csvData
   */
  formatBonusByCSV(csvData) {
    const currData = this.formatCsv(csvData);
    console.log('currData', currData);
    const data = [[], [], [], []];
    for (let n = 0, l = currData.length; n < l; n++) {
      const row = currData[n];
      console.log('row', row);
      data[row[1] - 1].push([row[2], row[3]]);
    }
    return data;
  }

  /**
   * 分割hash数值
   * @param hash hash
   * @param step 步长
   */
  getNumsByHash(hash, step = 2) {
    let res = [];
    for (let i = 0; i < hash.length; i += step) {
      let dext = hash[i] + hash[i + 1];
      let hext = parseInt(dext, 16);
      res.push(hext);
    }
    return res;
  }

  /**
   * 通过模数获取hash结果
   * @param hash
   * @param modulusList 模数
   * @param step 步长
   */
  getResultNumsByHash(hash, modulusList, step = 4) {
    let hashNums = this.getNumsByHash(hash);
    return modulusList.map((modulus, i) => {
      let nums = hashNums.slice(i * step, (i + 1) * step);
      let result = nums
        .map((nums, i) => {
          return nums / Math.pow(256, i + 1);
        })
        .reduce((res, num) => {
          return res + num;
        }, 0);
      return Math.floor(result * modulus);
    });
  }
}

const sobResult = new SobResult();
