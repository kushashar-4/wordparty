import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function WordPartyTesting() {
  const socket = io.connect("http://localhost:3000");
}
