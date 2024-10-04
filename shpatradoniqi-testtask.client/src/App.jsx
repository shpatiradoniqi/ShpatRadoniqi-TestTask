import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [drawing, setDrawing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [perimeter, setPerimeter] = useState(0);
    const [validationError, setValidationError] = useState('');
    const drawingAreaRef = useRef(null);

    const apiUrl = 'http://localhost:5285/SvgDimensions';

    useEffect(() => {
        // Fetch initial dimensions
        const fetchInitialDimensions = async () => {
            try {
                const response = await axios.get(apiUrl);
                setDimensions(response.data);
                setPerimeter(2 * (response.data.width + response.data.height));
            } catch (error) {
                console.error('Error fetching initial dimensions:', error);
                setValidationError(error.response?.data || 'Failed to fetch initial dimensions.');
            }
        };
        fetchInitialDimensions();
    }, [apiUrl]);

    const startDrawing = (e) => {
        setDrawing(true);
        const rect = drawingAreaRef.current.getBoundingClientRect();
        setStartX(e.clientX - rect.left);
        setStartY(e.clientY - rect.top);
    };

    const drawRectangle = (e) => {
        if (!drawing) return;
        const rect = drawingAreaRef.current.getBoundingClientRect();
        const newWidth = Math.max(0, e.clientX - rect.left - startX);
        const newHeight = Math.max(0, e.clientY - rect.top - startY);
        setDimensions({ width: newWidth, height: newHeight });
        setPerimeter(2 * (newWidth + newHeight));
    };

    const stopDrawing = async () => {
        setDrawing(false);
        try {
            // Change PUT to POST and update the URL to point to the correct API endpoint
            await axios.post(`${apiUrl}/save-rectangle`, dimensions);
            await axios.post(`${apiUrl}/validate-rectangle`, dimensions);
            setValidationError('');
        } catch (error) {
            console.error('Error updating dimensions:', error);
            setValidationError(error.response?.data?.error || 'Failed to update dimensions.');
        }
    };


    const resetDrawing = () => {
        setDimensions({ width: 0, height: 0 });
        setPerimeter(0);
        setValidationError('');
    };

    return (
        <div className="app">
            <h1>Rectangle Drawer</h1>
            <div
                className="drawing-area"
                ref={drawingAreaRef}
                onMouseDown={startDrawing}
                onMouseMove={drawRectangle}
                onMouseUp={stopDrawing}
                style={{ position: 'relative', border: '1px solid black', width: '600px', height: '400px' }}
            >
                {/* Drawing the rectangle */}
                <div
                    className="rect"
                    style={{
                        width: `${dimensions.width}px`,
                        height: `${dimensions.height}px`,
                        position: 'absolute',
                        left: `${startX}px`,
                        top: `${startY}px`,
                        backgroundColor: 'rgba(0, 150, 136, 0.4)',
                        border: '2px solid teal',
                        borderRadius: '5px',
                        transition: 'all 0.2s ease-in-out'
                    }}
                />
            </div>
            <div className="info">
                <p>Perimeter: {perimeter} px</p>
                <p>Width: {dimensions.width} px</p>
                <p>Height: {dimensions.height} px</p>
                {validationError && <p className="error">{validationError}</p>}
                <button onClick={resetDrawing}>Reset</button>
            </div>
        </div>
    );
};

export default App;