# Cybor's Cube 2x - Advanced Rubik's Cube Solver

**Author:** Abhishek Tiwary (2025)

## Description

Cybor's Cube 2x is an extremely efficient Rubik's Cube solving algorithm designed particularly for high-speed robots. This software represents the cutting edge in Rubik's Cube solving technology, based on Herbert Kociemba's two-phase algorithm with significant robot-optimized improvements.

## Features

### Robot-Optimized Mechanics
- Direct consideration of axial robot mechanics
- Parallel movement of opposite faces
- 180-degree turns optimization (approximately twice as long as 90-degree turns)
- 15-20% faster execution on average

### Multi-Threading Capabilities
- Single-solve multi-threading with arbitrary thread count
- 10+ times speed-ups even on moderate hardware
- Advanced parallelization parameters

### Multiple Solution Search
- Search for multiple solutions simultaneously
- Post-selection considering additional execution parameters
- Turn transition optimization

### Algorithm Modes
- **QT Mode**: Quarter-turn metric (only 90-degree moves)
- **AX Mode**: Axial metric (opposite faces manipulated simultaneously)
- **F5 Mode**: Uses only 5 faces (never turning the B-face)
- **Compression**: Automatic compression of QT-mode solutions back to HT

### Command-Line Interface
- Interactive terminal simulation
- Support for solve, scramble, and bench commands
- FACECUBE notation input/output
- Comprehensive benchmarking tools

### Performance Features
- Average solution lengths as low as 14.71 moves in AXHT metric
- Solutions typically found in 15-25 moves
- Optimized for Guinness World Record robot attempts
- Advanced coordinate systems and table generation

## How to Use

1. **Open the Application**: Double-click `index.html` to open in your browser
2. **Solver Tab**: 
   - Input cube state in FACECUBE notation or use scramble
   - Configure algorithm settings (modes, threads, parameters)
   - Click solve to get optimized solution
   - Apply solution to see animated solve sequence
3. **Benchmark Tab**: Run performance tests with different configurations
4. **Settings Tab**: Adjust solver parameters and robot optimizations
5. **Terminal**: Use command-line interface for advanced operations

## Commands

- `solve [FACECUBE]`: Solve cube from given state
- `scramble`: Generate random scramble
- `bench`: Run performance benchmark
- `help`: Show available commands

## Technical Details

Based on Herbert Kociemba's two-phase algorithm with the following improvements:
- Robot-aware move optimization
- Multi-threading support
- Axial robot mechanics consideration
- Advanced table decomposition
- Redundant maneuver elimination
- High thread-count utilization

## Installation

No installation required! Simply extract the ZIP file and open `index.html` in any modern web browser.

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No additional dependencies

## Performance

Benchmarks show performance improvements over standard implementations:
- Faster solving with less table decomposition
- Better coordinate systems for table generation
- Optimized for robot execution patterns
- Support for multiple solution evaluation

## About the Algorithm

The two-phase algorithm solves any Rubik's cube configuration in two distinct phases:
1. **Phase 1**: Orient all corners and edges, position UD-slice edges
2. **Phase 2**: Solve remaining cube using restricted move set <U,D,R2,L2,F2,B2>

This implementation includes robot-specific optimizations that make it ideal for:
- High-speed solving robots
- Competition timing requirements
- Parallel face manipulation
- Optimal move sequence generation

## License

This implementation is based on open-source cube solving algorithms and is provided for educational and research purposes.

---

**Built for robotics engineers and cube solving enthusiasts who demand the best performance.**
