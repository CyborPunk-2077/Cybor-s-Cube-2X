# Technical Documentation

## Algorithm Overview

Cybor's Cube 2x implements Herbert Kociemba's two-phase algorithm with significant robot-optimized enhancements.

### Two-Phase Algorithm Details

#### Phase 1: G1 Preparation
- Orient all corners (2187 possibilities)
- Orient all edges (2048 possibilities) 
- Position UD-slice edges (495 possibilities)
- Uses moves: U, D, R, L, F, B, R2, L2, F2, B2

#### Phase 2: Final Solution
- Solve cube using restricted move set: <U, D, R2, L2, F2, B2>
- Maximum 18 moves in this phase
- Combined phases typically produce solutions in 15-25 moves

### Robot Optimizations

#### Axial Mechanics
- Considers robot's ability to move opposite faces simultaneously
- Accounts for timing differences between 90° and 180° turns
- Optimizes move sequences for parallel execution

#### Multi-Threading Architecture
- Parallel search across multiple solution paths
- Load balancing for optimal thread utilization
- Advanced splitting parameters for high thread counts

### Compilation Flags

#### -DQT: Quarter-Turn Metric
- Only allows 90-degree moves
- Useful for robots with limited rotation capability
- More moves but simpler execution

#### -DAX: Axial Metric  
- Enables simultaneous opposite face manipulation
- Optimized for axial robot designs
- Significantly reduces execution time

#### -DF5: Five-Face Mode
- Never rotates the B (back) face
- Useful for robots with limited access to back face
- Slight increase in move count but maintains solvability

### Performance Parameters

#### -c: Compression
- Compresses QT solutions to AXHT format
- Especially useful in AXQT mode
- Merges sequences like D (U D) automatically

#### -l: Maximum Length
- Sets upper bound on solution length
- Default: -1 (search until time limit)
- Useful for time-constrained applications

#### -m: Time Limit  
- Milliseconds allocated for search
- Default: 10ms for quick solutions
- Longer times may find shorter solutions

#### -n: Solution Count
- Number of solutions to return
- Allows selection of best solution for robot execution
- Considers additional parameters like turn transitions

#### -s: Split Parameter
- Advanced parallelization control
- Splits IDA search tasks for better thread utilization
- Recommended: set so that -t/-s ≈ 6 (or 4 with -DF5)

#### -t: Thread Count
- Number of parallel threads
- Best practice: match CPU thread count
- Enables 10+ times speedup on modern hardware

#### -w: Warmup Solves
- Number of random solves on startup
- Optimizes cache for performance-critical applications
- Recommended for robot systems

### Data Structures

#### Coordinate Systems
- Corner orientation: 0-2186
- Edge orientation: 0-2047  
- UD-slice position: 0-494
- Optimized pruning tables for fast lookup

#### Move Representation
- Standard Singmaster notation: U, R, F, D, L, B
- Prime notation for counterclockwise: U', R', F', D', L', B'
- Double moves: U2, R2, F2, D2, L2, B2
- Axial notation for simultaneous moves: (U D), (R L), (F B)

### Performance Benchmarks

#### Standard Metrics
- Average solution length: 14.71 moves (AXHT)
- Typical solve time: 0.01-0.4 seconds
- Maximum solve time: ~2 seconds (rare cases)
- Success rate: >99.9% within time limits

#### Robot Performance
- 15-20% execution time improvement with axial optimization
- Parallel face movements reduce total execution time
- Optimized for sub-second robot solving

### Hardware Requirements
- Minimum: 1GB RAM for table storage
- Recommended: Multi-core CPU for threading benefits
- Storage: ~80MB for lookup tables (generated on first run)
- Network: Not required (fully offline capable)

### Integration Guidelines

#### Robot Control Interface
- STDIN/STDOUT pipe communication
- FACECUBE notation for cube state input
- Standard move notation for output sequences
- Status codes for error handling

#### API Usage
```
solve DUUBULDBFRBFRRULLLBRDFFFBLURDBFDFDRFRULBLUFDURRBLBDUDL
// Returns: U R2 U R2 D' F2 L2 D' B2 U B2 R2 U2 R2 D2 L2 (16f)

scramble  
// Returns: R U R' D' F2 L U' B D' F' R B2 L' U F

bench
// Runs benchmark using cubes from bench.cubes file
```

#### Error Handling
- Invalid cube states are detected and reported
- Impossible configurations are rejected
- Timeout handling for complex scrambles
- Graceful degradation for resource constraints

This technical implementation provides the foundation for world-record capable cube solving robots while maintaining the flexibility needed for various robot architectures and constraints.
