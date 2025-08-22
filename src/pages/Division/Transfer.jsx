import React, { useState, useRef, useEffect } from 'react';

const Transfer = () => {
    // Initial data for both tables with 10 items each
    const [leftTableData, setLeftTableData] = useState([
        { id: 1, name: 'ZO-001', value: 100, category: 'A' },
        { id: 2, name: 'ZO-002', value: 200, category: 'B' },
        { id: 3, name: 'ZO-003', value: 300, category: 'A' },
        { id: 4, name: 'ZO-004', value: 400, category: 'C' },
        { id: 5, name: 'ZO-005', value: 500, category: 'B' },
        { id: 6, name: 'ZO-006', value: 600, category: 'A' },
        { id: 7, name: 'ZO-007', value: 700, category: 'C' },
        { id: 8, name: 'ZO-008', value: 800, category: 'B' },
        { id: 9, name: 'ZO-009', value: 900, category: 'A' },
        { id: 10, name: 'ZO-010', value: 1000, category: 'C' }
    ]);

    const [rightTableData, setRightTableData] = useState([
        { id: 11, name: 'CO-011', value: 1100, category: 'X' },
        { id: 12, name: 'CO-012', value: 1200, category: 'Y' },
        { id: 13, name: 'CO-013', value: 1300, category: 'Z' },
        { id: 14, name: 'CO-014', value: 1400, category: 'X' },
        { id: 15, name: 'CO-015', value: 1500, category: 'Y' },
        { id: 16, name: 'CO-016', value: 1600, category: 'Z' },
        { id: 17, name: 'CO-017', value: 1700, category: 'X' },
        { id: 18, name: 'CO-018', value: 1800, category: 'Y' },
        { id: 19, name: 'CO-019', value: 1900, category: 'Z' },
        { id: 20, name: 'CO-020', value: 2000, category: 'X' }
    ]);

    // State for connections and drawing
    const [connections, setConnections] = useState([]);
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [selectedRight, setSelectedRight] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingLine, setDrawingLine] = useState(null);

    // Refs for elements
    const leftTableRef = useRef();
    const rightTableRef = useRef();
    const svgRef = useRef();
    const leftScrollRef = useRef();
    const rightScrollRef = useRef();

    // State to force updates
    const [updateKey, setUpdateKey] = useState(0);

    // Function to get position of category cell by ID
    const getElementPosition = (id, table) => {
        const element = document.getElementById(`${table}-category-${id}`);
        if (!element || !svgRef.current) return null;

        const rect = element.getBoundingClientRect();
        const svgRect = svgRef.current.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2 - svgRect.left,
            y: rect.top + rect.height / 2 - svgRect.top
        };
    };

    // Function to get smooth path
    const getSmoothPath = (start, end) => {
        if (!start || !end) return '';
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const control1x = start.x + dx * 0.3;
        const control1y = start.y + dy * 0.1;
        const control2x = start.x + dx * 0.7;
        const control2y = start.y + dy * 0.9;
        return `M${start.x},${start.y} C ${control1x},${control1y} ${control2x},${control2y} ${end.x},${end.y}`;
    };

    // Function to handle left table item click
    const handleLeftClick = (item) => {
        if (selectedRight) {
            // If we already have a right item selected, create a connection
            const newConnection = { left: item.id, right: selectedRight };
            setConnections([...connections, newConnection]);
            setSelectedLeft(null);
            setSelectedRight(null);
        } else {
            // Otherwise, select this left item and start drawing
            setSelectedLeft(item.id);
            setSelectedRight(null);
            setIsDrawing(true);

            const leftPos = getElementPosition(item.id, 'left');
            if (leftPos) {
                setDrawingLine({ start: leftPos, end: leftPos });
            }
        }
    };

    // Function to handle right table item click
    const handleRightClick = (item) => {
        if (selectedLeft) {
            // If we already have a left item selected, create a connection
            const newConnection = { left: selectedLeft, right: item.id };
            setConnections([...connections, newConnection]);
            setSelectedLeft(null);
            setSelectedRight(null);
            setIsDrawing(false);
            setDrawingLine(null);
        } else {
            // Otherwise, select this right item
            setSelectedLeft(null);
            setSelectedRight(item.id);
        }
    };

    // Function to handle mouse movement for drawing
    const handleMouseMove = (e) => {
        if (!isDrawing || !drawingLine || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;

        setDrawingLine({
            ...drawingLine,
            end: { x, y }
        });
    };

    // Function to handle submit (swap connected items)
    const handleSubmit = () => {
        if (connections.length === 0) return;

        const newLeftData = [...leftTableData];
        const newRightData = [...rightTableData];

        connections.forEach(conn => {
            const leftIndex = newLeftData.findIndex(item => item.id === conn.left);
            const rightIndex = newRightData.findIndex(item => item.id === conn.right);

            if (leftIndex !== -1 && rightIndex !== -1) {
                // Swap the items
                const temp = newLeftData[leftIndex];
                newLeftData[leftIndex] = newRightData[rightIndex];
                newRightData[rightIndex] = temp;
            }
        });

        setLeftTableData(newLeftData);
        setRightTableData(newRightData);
        setConnections([]);
        setSelectedLeft(null);
        setSelectedRight(null);
        setIsDrawing(false);
        setDrawingLine(null);
    };

    // Function to clear all connections
    const handleClear = () => {
        setConnections([]);
        setSelectedLeft(null);
        setSelectedRight(null);
        setIsDrawing(false);
        setDrawingLine(null);
    };

    // Function to remove a specific connection
    const removeConnection = (index) => {
        const newConnections = [...connections];
        newConnections.splice(index, 1);
        setConnections(newConnections);
    };

    // Update drawing line when selectedLeft changes
    useEffect(() => {
        if (selectedLeft) {
            const leftPos = getElementPosition(selectedLeft, 'left');
            if (leftPos) {
                setDrawingLine({ start: leftPos, end: leftPos });
            }
        }
    }, [selectedLeft]);

    // Force update on resize or scroll
    useEffect(() => {
        const handleUpdate = () => setUpdateKey(prev => prev + 1);

        window.addEventListener('resize', handleUpdate);
        document.addEventListener('scroll', handleUpdate, true);

        const leftScroll = leftScrollRef.current;
        const rightScroll = rightScrollRef.current;

        if (leftScroll) leftScroll.addEventListener('scroll', handleUpdate);
        if (rightScroll) rightScroll.addEventListener('scroll', handleUpdate);

        return () => {
            window.removeEventListener('resize', handleUpdate);
            document.removeEventListener('scroll', handleUpdate, true);
            if (leftScroll) leftScroll.removeEventListener('scroll', handleUpdate);
            if (rightScroll) rightScroll.removeEventListener('scroll', handleUpdate);
        };
    }, []);

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'A': 'bg-blue-100 text-blue-800',
            'B': 'bg-green-100 text-green-800',
            'C': 'bg-purple-100 text-purple-800',
            'X': 'bg-red-100 text-red-800',
            'Y': 'bg-yellow-100 text-yellow-800',
            'Z': 'bg-indigo-100 text-indigo-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-5">
            <div className="w-full">
                <div className="relative flex flex-col lg:flex-row justify-center items-start gap-8">
                    {/* Left Table - ZO Items */}
                    <div className="mt-1 bg-white rounded-xl p-6 w-full lg:w-2/5" ref={leftTableRef}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">ZO Items</h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {leftTableData.length} items
                            </span>
                        </div>
                        <div ref={leftScrollRef} className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="py-3 px-4 text-left">ID</th>
                                        <th className="py-3 px-4 text-left">Name</th>
                                        <th className="py-3 px-4 text-left">Value</th>
                                        <th className="py-3 px-4 text-left">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leftTableData.map((item) => (
                                        <tr
                                            key={item.id}
                                            id={`left-${item.id}`}
                                            className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${selectedLeft === item.id ? 'bg-blue-50 ring-2 ring-blue-500' : ''
                                                } ${connections.some(c => c.left === item.id) ? 'bg-blue-50' : ''}`}
                                            onClick={() => handleLeftClick(item)}
                                        >
                                            <td className="py-3 px-4 font-medium">{item.id}</td>
                                            <td className="py-3 px-4">{item.name}</td>
                                            <td className="py-3 px-4">${item.value}</td>
                                            <td className="py-3 px-4">
                                                <span id={`left-category-${item.id}`} className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Empty div for space in large screens */}
                    <div className="hidden lg:block w-1/5"></div>

                    {/* Right Table - CO Items */}
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-2/5" ref={rightTableRef}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">ZO Items</h2>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                {rightTableData.length} items
                            </span>
                        </div>
                        <div ref={rightScrollRef} className="overflow-x-auto ">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="py-3 px-4 text-left">ID</th>
                                        <th className="py-3 px-4 text-left">Name</th>
                                        <th className="py-3 px-4 text-left">Value</th>
                                        <th className="py-3 px-4 text-left">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rightTableData.map((item) => (
                                        <tr
                                            key={item.id}
                                            id={`right-${item.id}`}
                                            className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${selectedRight === item.id ? 'bg-red-50 ring-2 ring-red-500' : ''
                                                } ${connections.some(c => c.right === item.id) ? 'bg-red-50' : ''}`}
                                            onClick={() => handleRightClick(item)}
                                        >
                                            <td className="py-3 px-4 font-medium">{item.id}</td>
                                            <td className="py-3 px-4">{item.name}</td>
                                            <td className="py-3 px-4">${item.value}</td>
                                            <td className="py-3 px-4">
                                                <span id={`right-category-${item.id}`} className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SVG for drawing lines */}
                    <svg
                        ref={svgRef}
                        className="absolute inset-0 h-full w-full pointer-events-none"
                        onMouseMove={handleMouseMove}
                    >
                        {/* Render existing connections */}
                        {connections.map((conn, index) => {
                            const start = getElementPosition(conn.left, 'left');
                            const end = getElementPosition(conn.right, 'right');

                            if (!start || !end) return null;

                            const pathD = getSmoothPath(start, end);

                            return (
                                <g key={index} className="pointer-events-auto cursor-pointer" onClick={() => removeConnection(index)}>
                                    <title>Click to remove connection</title>
                                    <path
                                        d={pathD}
                                        stroke="#4f46e5"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx={end.x}
                                        cy={end.y}
                                        r="6"
                                        fill="#ef4444"
                                    />
                                </g>
                            );
                        })}

                        {/* Render drawing line */}
                        {drawingLine && (
                            <path
                                d={getSmoothPath(drawingLine.start, drawingLine.end)}
                                stroke="#ef4444"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                                strokeLinecap="round"
                            />
                        )}
                    </svg>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center mt-4 gap-4 w-full">
                <button
                    onClick={handleSubmit}
                    disabled={connections.length === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${connections.length > 0
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Transfer Connections ({connections.length})
                </button>

                <button
                    onClick={handleClear}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default Transfer;