
import { useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Room from "@/components/rooms/Room";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  
  if (!roomId) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No room ID provided</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <Room />
    </AppLayout>
  );
};

export default RoomPage;
