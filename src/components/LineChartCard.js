import React,{useEffect,useState} from 'react'
import { LineChart, Card,Title } from '@tremor/react'


function LineChartCard({ weatherDetails }) {
    const [chartData,setChartData] = useState([]);

    useEffect(()=>{
        const hourly = weatherDetails?.hourly?.time.map((time) => new Date(time).toLocaleString("en-US",{hour:"numeric",hour12:false}).slice(0.24));

            setChartData(hourly?.map((hour , i) =>({
                    Time : Number(hour),
                    Humidity : weatherDetails?.hourly?.relativehumidity_2m[i], 
            })) 
        );

    },[weatherDetails]);

  return (
        <Card>
            <Title>Humidity v/s time</Title>
            <LineChart
            className="mt-6"
            data={chartData}
            index="Time"
            categories={["Humidity"]}
            colors={["emerald"]}
            yAxisWidth={40}
            />
        </Card>
  )
}

export default LineChartCard