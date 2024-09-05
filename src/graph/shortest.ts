// import sys
// from math import inf

// N = int(input())
// M = int(input())

// graph = [[inf] * N for _ in range(N)]
// for _ in range(M):
//     a, b, weight = map(int, sys.stdin.readline().split())
//     graph[a-1][b-1] = min(weight, graph[a-1][b-1])

// for transitP in range(N):
//     for fromP in range(N):
//         for toP in range(N):
//             if fromP == toP: continue
//             graph[fromP][toP] = min(graph[fromP][toP], graph[fromP][transitP]+graph[transitP][toP])

// for i in graph:
//     print(' '.join(map(str, i)).replace('inf', '0'))