import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

interface ChartData {
    room: string;
    usage: number;
}

const chartSetting = {
    height: 400,
};

const HorizontalBars = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3100/light/usage');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data: Record<string, number> = await response.json();

                const transformedData: ChartData[] = Object.entries(data).map(([room, usage]) => ({
                    room,
                    usage,
                }));

                setChartData(transformedData);
                setIsLoading(false);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error fetching data');
                setIsLoading(false);
            }
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
        <BarChart
            sx={{
                backgroundColor: '#ffffff',
                borderRadius: '25px',
                width: '100%',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            }}
            layout="horizontal"
            height={chartSetting.height}
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
                    color: '#070707',
                },
            ]}
        />
    );
};

export default HorizontalBars;
