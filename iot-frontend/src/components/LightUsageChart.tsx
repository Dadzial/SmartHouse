import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

interface ChartData {
    room: string;
    usage: number;
}

const chartSetting = {
    height: 400,
    margin: { left: 40 },
};

export default function HorizontalBars() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:3100/light/usage')
                .then((response) => response.json())
                .then((data) => {
                    const transformedData = Object.entries(data).map(([room, usage]) => ({
                        room,
                        usage: usage as number,
                    }));
                    setChartData(transformedData);
                    setIsLoading(false);
                    setError(null);
                })
                .catch((error) => {
                    setError(error.message);
                    setIsLoading(false);
                });
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);

    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const usageData = chartData.map((item) => item.usage);
    const rooms = chartData.map((item) => item.room);

    return (
        <BarChart sx={{ backgroundColor: '#ffffff', borderRadius: '25px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            layout="horizontal"
            height={chartSetting.height}
            margin={chartSetting.margin}
            xAxis={[
                {
                    label: 'Usage (minutes)',
                    min: 0,
                },
            ]}
            yAxis={[
                {
                    scaleType: 'band',
                    data: rooms,
                },
            ]}
            series={[
                {
                    label: 'Light Usage',
                    data: usageData,
                },
            ]}
        />
    );
}
