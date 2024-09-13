import { useEffect, useState } from "react";
import { Text, SafeAreaView, TextInput, Pressable } from "react-native";

export default function HomeScreen() {
  const [text, setText] = useState<string>();
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [newMessage, setNewMessage] = useState<string>("NOT");

  useEffect(() => {
    const socket = new WebSocket("ws://10.0.2.2:8585");

    console.log("Socket: ", socket);

    socket.onopen = () => {
      console.log("Connection");
      setSocket(socket);
    };

    socket.onmessage = (message) => {
      console.log("Message received:", message.data);
      setNewMessage(message.data);
    };

    socket.onclose = () => {
      console.log("CLOSED");
    };
    socket.onerror = (e: any) => {
      console.log("Error");
      console.log(e.message);
    };
  }, []);
  return (
    <SafeAreaView className="flex justify-center items-center h-screen">
      <Text>This: {newMessage}</Text>
      <TextInput
        className="border border-black rounded-2xl w-full"
        placeholder=" Type here..."
        onChangeText={setText}
        value={text}
      />
      <Pressable
        className="flex justify-center items-center bg-black rounded-xl w-12 h-8"
        onPress={() => {
          socket?.send(text || "");
          return setText("");
        }}
      >
        <Text className="text-white">Send</Text>
      </Pressable>
    </SafeAreaView>
  );
}
