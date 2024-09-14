import { useCallback, useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  View,
} from "react-native";

interface Message {
  type: "sender" | "receiver";
  message: string;
}

export default function HomeScreen() {
  const [text, setText] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  useEffect(() => {
    const newSocket = new WebSocket("ws://10.0.2.2:8585");

    newSocket.onopen = () => {
      console.log("Connection opened");
      setSocket(newSocket);
    };

    newSocket.onmessage = (event) => {
      handleNewMessage({ type: "receiver", message: event.data });
    };

    newSocket.onclose = () => {
      console.log("Connection closed");
    };

    newSocket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    return () => {
      newSocket.close();
    };
  }, [handleNewMessage]);

  //   socket.onmessage = (message) => {
  //     // console.log("Message received:", message.data);
  //     // setReceivedMessage(message.data);
  //     console.log("INSIDE: ", latestMessage);
  //     setLatestMessage([...latestMessage, { message: message.data }]);
  //   };

  const handleSend = () => {
    if (socket && text.trim()) {
      socket.send(text);
      handleNewMessage({ type: "sender", message: text });
      setText("");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Text
      className={`p-3 rounded-3xl m-2 ${
        item.type === "receiver"
          ? "self-start bg-[#1f1e25] text-white"
          : "self-end	 bg-[#5720ff] text-white"
      }`}
    >
      {item.message}
    </Text>
  );

  return (
    <SafeAreaView className="bg-black h-screen">
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(index) => index.toString()}
      />
      <SafeAreaView className="bg-[#0d0e1e] p-3 border-t border-slate-50">
        <View className="flex flex-row items-center">
          <TextInput
            className="flex-1 bg-[#171927] border border-white rounded-lg text-white px-2 py-2 mr-2"
            placeholder="Type a message..."
            placeholderTextColor="#ffffff"
            value={text}
            onChangeText={setText}
          />
          <Pressable
            className="justify-center items-center p-2 px-4 rounded-xl bg-[#5720ff]"
            onPress={handleSend}
          >
            <Text className="text-white">Send</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
