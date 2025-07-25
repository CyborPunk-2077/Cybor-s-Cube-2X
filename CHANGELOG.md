# Changelog

## Version 2.0.0 (2025)

### New Features
- Considerably faster solving performance through less table decomposition
- Proper elimination of redundant maneuvers in QT-modes
- Significantly faster initial table generation through better coordinates
- Much better utilization of high thread-counts via the -s parameter
- Ability to return multiple solutions with -n parameter
- Automatic compression of QT-mode solutions back to HT using -c option
- Cleaner code through major refactoring

### Robot Optimizations
- Direct consideration of axial robot mechanics
- Parallel movement optimization for opposite faces
- 180-degree turn timing optimization
- 15-20% performance improvement for robot execution

### Technical Improvements
- Advanced multi-threading support
- Multiple solution search capabilities
- Enhanced coordinate systems
- Optimized table generation
- Improved parallelization parameters

## Version 1.0.0 (Initial Release)
- Basic two-phase algorithm implementation
- Standard move generation
- Single-threaded solving
- Basic cube representation
