import '../App.css';
import BasicCard from "../components/RoomCard";
import io from "socket.io-client";
import {useEffect, useState} from "react";
import bath from "../assets/bathtub.png";
import kitchen from "../assets/kitchen.png";
import room from "../assets/bed.png";
import garage from "../assets/private-garage.png";
import PermanentDrawer from "./SideBarDashBoard.tsx";
import HorizontalBars from "../components/LightUsageChart.tsx";
import LightSchedulerCard from "../components/LightScheduler.tsx";

const socket = io('http://localhost:3000');

const rooms = [
    { name: "Kitchen", iconPath: kitchen },
    { name: "Garage", iconPath: garage },
    { name: "Bath", iconPath: bath },
    { name: "Room", iconPath: room },
];

const LightsView = () => {
    const [roomStates, setRoomStates] = useState<Record<string, boolean>>({
        kitchen: false,
        garage: false,
        room: false,
        bath: false,
    });

    useEffect(() => {
        socket.emit("light:getStatus");

        socket.on("light:getStatus", (data) => {
            if (data && typeof data === 'object') {
                setRoomStates((prev) => ({ ...prev, ...data }));
            }
        });

        socket.on("light:statusUpdate", (data) => {
            if (data && typeof data === 'object') {
                setRoomStates((prev) => ({ ...prev, ...data }));
            }
        });

        return () => {
            socket.off("light:getStatus");
            socket.off("light:statusUpdate");
        };
    }, []);

    const handleToggle = (roomName: string) => {
        const newState = !roomStates[roomName];
        setRoomStates(prev => ({ ...prev, [roomName]: newState }));
        socket.emit("light:toggle", { room: roomName.toLowerCase(), state: newState });
    };

    return (
        <div className="App">
            <PermanentDrawer/>
            <div className="main-content">
                <div className="card-grid">
                    {rooms.map((room, index) => (
                        <BasicCard
                            key={index}
                            title={room.name}
                            iconPath={room.iconPath}
                            state={roomStates[room.name.toLowerCase()]}
                            onToggle={() => handleToggle(room.name.toLowerCase())}
                        />
                    ))}
                </div>
                <div className="chart-and-scheduler">
                    <div className="chart-container">
                        <HorizontalBars />
                    </div>
                    <div className="scheduler-container">
                        <LightSchedulerCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LightsView;
