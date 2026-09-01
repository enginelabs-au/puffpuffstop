import AppIntents

@available(iOS 16.0, *)
enum LogCountChoice: Int, AppEnum {
  static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Log count")

  case n1 = 1
  case n2 = 2
  case n3 = 3
  case n4 = 4
  case n5 = 5
  case n6 = 6
  case n7 = 7
  case n8 = 8
  case n9 = 9
  case n10 = 10
  case n11 = 11
  case n12 = 12
  case n13 = 13
  case n14 = 14
  case n15 = 15
  case n16 = 16
  case n17 = 17
  case n18 = 18
  case n19 = 19
  case n20 = 20
  case n21 = 21
  case n22 = 22
  case n23 = 23
  case n24 = 24
  case n25 = 25
  case n26 = 26
  case n27 = 27
  case n28 = 28
  case n29 = 29
  case n30 = 30
  case n31 = 31
  case n32 = 32
  case n33 = 33
  case n34 = 34
  case n35 = 35
  case n36 = 36
  case n37 = 37
  case n38 = 38
  case n39 = 39
  case n40 = 40
  case n41 = 41
  case n42 = 42
  case n43 = 43
  case n44 = 44
  case n45 = 45
  case n46 = 46
  case n47 = 47
  case n48 = 48
  case n49 = 49
  case n50 = 50
  case n51 = 51
  case n52 = 52
  case n53 = 53
  case n54 = 54
  case n55 = 55
  case n56 = 56
  case n57 = 57
  case n58 = 58
  case n59 = 59
  case n60 = 60
  case n61 = 61
  case n62 = 62
  case n63 = 63
  case n64 = 64
  case n65 = 65
  case n66 = 66
  case n67 = 67
  case n68 = 68
  case n69 = 69
  case n70 = 70
  case n71 = 71
  case n72 = 72
  case n73 = 73
  case n74 = 74
  case n75 = 75
  case n76 = 76
  case n77 = 77
  case n78 = 78
  case n79 = 79
  case n80 = 80
  case n81 = 81
  case n82 = 82
  case n83 = 83
  case n84 = 84
  case n85 = 85
  case n86 = 86
  case n87 = 87
  case n88 = 88
  case n89 = 89
  case n90 = 90
  case n91 = 91
  case n92 = 92
  case n93 = 93
  case n94 = 94
  case n95 = 95
  case n96 = 96
  case n97 = 97
  case n98 = 98
  case n99 = 99
  case n100 = 100
  case n101 = 101
  case n102 = 102
  case n103 = 103
  case n104 = 104
  case n105 = 105
  case n106 = 106
  case n107 = 107
  case n108 = 108
  case n109 = 109
  case n110 = 110
  case n111 = 111
  case n112 = 112
  case n113 = 113
  case n114 = 114
  case n115 = 115
  case n116 = 116
  case n117 = 117
  case n118 = 118
  case n119 = 119
  case n120 = 120
  case n150 = 150
  case n200 = 200
  case n250 = 250
  case n300 = 300
  case n400 = 400
  case n500 = 500
  case n750 = 750
  case n1000 = 1000

  static var caseDisplayRepresentations: [LogCountChoice: DisplayRepresentation] = [
    .n1: "1",
    .n2: "2",
    .n3: "3",
    .n4: "4",
    .n5: "5",
    .n6: "6",
    .n7: "7",
    .n8: "8",
    .n9: "9",
    .n10: "10",
    .n11: "11",
    .n12: "12",
    .n13: "13",
    .n14: "14",
    .n15: "15",
    .n16: "16",
    .n17: "17",
    .n18: "18",
    .n19: "19",
    .n20: "20",
    .n21: "21",
    .n22: "22",
    .n23: "23",
    .n24: "24",
    .n25: "25",
    .n26: "26",
    .n27: "27",
    .n28: "28",
    .n29: "29",
    .n30: "30",
    .n31: "31",
    .n32: "32",
    .n33: "33",
    .n34: "34",
    .n35: "35",
    .n36: "36",
    .n37: "37",
    .n38: "38",
    .n39: "39",
    .n40: "40",
    .n41: "41",
    .n42: "42",
    .n43: "43",
    .n44: "44",
    .n45: "45",
    .n46: "46",
    .n47: "47",
    .n48: "48",
    .n49: "49",
    .n50: "50",
    .n51: "51",
    .n52: "52",
    .n53: "53",
    .n54: "54",
    .n55: "55",
    .n56: "56",
    .n57: "57",
    .n58: "58",
    .n59: "59",
    .n60: "60",
    .n61: "61",
    .n62: "62",
    .n63: "63",
    .n64: "64",
    .n65: "65",
    .n66: "66",
    .n67: "67",
    .n68: "68",
    .n69: "69",
    .n70: "70",
    .n71: "71",
    .n72: "72",
    .n73: "73",
    .n74: "74",
    .n75: "75",
    .n76: "76",
    .n77: "77",
    .n78: "78",
    .n79: "79",
    .n80: "80",
    .n81: "81",
    .n82: "82",
    .n83: "83",
    .n84: "84",
    .n85: "85",
    .n86: "86",
    .n87: "87",
    .n88: "88",
    .n89: "89",
    .n90: "90",
    .n91: "91",
    .n92: "92",
    .n93: "93",
    .n94: "94",
    .n95: "95",
    .n96: "96",
    .n97: "97",
    .n98: "98",
    .n99: "99",
    .n100: "100",
    .n101: "101",
    .n102: "102",
    .n103: "103",
    .n104: "104",
    .n105: "105",
    .n106: "106",
    .n107: "107",
    .n108: "108",
    .n109: "109",
    .n110: "110",
    .n111: "111",
    .n112: "112",
    .n113: "113",
    .n114: "114",
    .n115: "115",
    .n116: "116",
    .n117: "117",
    .n118: "118",
    .n119: "119",
    .n120: "120",
    .n150: "150",
    .n200: "200",
    .n250: "250",
    .n300: "300",
    .n400: "400",
    .n500: "500",
    .n750: "750",
    .n1000: "1000"
  ]
}

@available(iOS 16.0, *)
enum RemoveCountChoice: Int, AppEnum {
  static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Remove count")

  case n1 = 1
  case n2 = 2
  case n3 = 3
  case n4 = 4
  case n5 = 5
  case n6 = 6
  case n7 = 7
  case n8 = 8
  case n9 = 9
  case n10 = 10
  case n11 = 11
  case n12 = 12
  case n13 = 13
  case n14 = 14
  case n15 = 15
  case n16 = 16
  case n17 = 17
  case n18 = 18
  case n19 = 19
  case n20 = 20
  case n21 = 21
  case n22 = 22
  case n23 = 23
  case n24 = 24
  case n25 = 25
  case n26 = 26
  case n27 = 27
  case n28 = 28
  case n29 = 29
  case n30 = 30
  case n31 = 31
  case n32 = 32
  case n33 = 33
  case n34 = 34
  case n35 = 35
  case n36 = 36
  case n37 = 37
  case n38 = 38
  case n39 = 39
  case n40 = 40
  case n41 = 41
  case n42 = 42
  case n43 = 43
  case n44 = 44
  case n45 = 45
  case n46 = 46
  case n47 = 47
  case n48 = 48
  case n49 = 49
  case n50 = 50
  case n51 = 51
  case n52 = 52
  case n53 = 53
  case n54 = 54
  case n55 = 55
  case n56 = 56
  case n57 = 57
  case n58 = 58
  case n59 = 59
  case n60 = 60
  case n61 = 61
  case n62 = 62
  case n63 = 63
  case n64 = 64
  case n65 = 65
  case n66 = 66
  case n67 = 67
  case n68 = 68
  case n69 = 69
  case n70 = 70
  case n71 = 71
  case n72 = 72
  case n73 = 73
  case n74 = 74
  case n75 = 75
  case n76 = 76
  case n77 = 77
  case n78 = 78
  case n79 = 79
  case n80 = 80
  case n81 = 81
  case n82 = 82
  case n83 = 83
  case n84 = 84
  case n85 = 85
  case n86 = 86
  case n87 = 87
  case n88 = 88
  case n89 = 89
  case n90 = 90
  case n91 = 91
  case n92 = 92
  case n93 = 93
  case n94 = 94
  case n95 = 95
  case n96 = 96
  case n97 = 97
  case n98 = 98
  case n99 = 99
  case n100 = 100
  case n101 = 101
  case n102 = 102
  case n103 = 103
  case n104 = 104
  case n105 = 105
  case n106 = 106
  case n107 = 107
  case n108 = 108
  case n109 = 109
  case n110 = 110
  case n111 = 111
  case n112 = 112
  case n113 = 113
  case n114 = 114
  case n115 = 115
  case n116 = 116
  case n117 = 117
  case n118 = 118
  case n119 = 119
  case n120 = 120
  case n150 = 150
  case n200 = 200
  case n250 = 250
  case n300 = 300
  case n400 = 400
  case n500 = 500
  case n750 = 750
  case n1000 = 1000

  static var caseDisplayRepresentations: [RemoveCountChoice: DisplayRepresentation] = [
    .n1: "1",
    .n2: "2",
    .n3: "3",
    .n4: "4",
    .n5: "5",
    .n6: "6",
    .n7: "7",
    .n8: "8",
    .n9: "9",
    .n10: "10",
    .n11: "11",
    .n12: "12",
    .n13: "13",
    .n14: "14",
    .n15: "15",
    .n16: "16",
    .n17: "17",
    .n18: "18",
    .n19: "19",
    .n20: "20",
    .n21: "21",
    .n22: "22",
    .n23: "23",
    .n24: "24",
    .n25: "25",
    .n26: "26",
    .n27: "27",
    .n28: "28",
    .n29: "29",
    .n30: "30",
    .n31: "31",
    .n32: "32",
    .n33: "33",
    .n34: "34",
    .n35: "35",
    .n36: "36",
    .n37: "37",
    .n38: "38",
    .n39: "39",
    .n40: "40",
    .n41: "41",
    .n42: "42",
    .n43: "43",
    .n44: "44",
    .n45: "45",
    .n46: "46",
    .n47: "47",
    .n48: "48",
    .n49: "49",
    .n50: "50",
    .n51: "51",
    .n52: "52",
    .n53: "53",
    .n54: "54",
    .n55: "55",
    .n56: "56",
    .n57: "57",
    .n58: "58",
    .n59: "59",
    .n60: "60",
    .n61: "61",
    .n62: "62",
    .n63: "63",
    .n64: "64",
    .n65: "65",
    .n66: "66",
    .n67: "67",
    .n68: "68",
    .n69: "69",
    .n70: "70",
    .n71: "71",
    .n72: "72",
    .n73: "73",
    .n74: "74",
    .n75: "75",
    .n76: "76",
    .n77: "77",
    .n78: "78",
    .n79: "79",
    .n80: "80",
    .n81: "81",
    .n82: "82",
    .n83: "83",
    .n84: "84",
    .n85: "85",
    .n86: "86",
    .n87: "87",
    .n88: "88",
    .n89: "89",
    .n90: "90",
    .n91: "91",
    .n92: "92",
    .n93: "93",
    .n94: "94",
    .n95: "95",
    .n96: "96",
    .n97: "97",
    .n98: "98",
    .n99: "99",
    .n100: "100",
    .n101: "101",
    .n102: "102",
    .n103: "103",
    .n104: "104",
    .n105: "105",
    .n106: "106",
    .n107: "107",
    .n108: "108",
    .n109: "109",
    .n110: "110",
    .n111: "111",
    .n112: "112",
    .n113: "113",
    .n114: "114",
    .n115: "115",
    .n116: "116",
    .n117: "117",
    .n118: "118",
    .n119: "119",
    .n120: "120",
    .n150: "150",
    .n200: "200",
    .n250: "250",
    .n300: "300",
    .n400: "400",
    .n500: "500",
    .n750: "750",
    .n1000: "1000"
  ]
}
