export const generatedEmoji = () => {
  const emojis = [
    ":ahhh:",
    ":catjam:",
    ":typingcat:",
    ":partee5:",
    ":handshake:",
    ":thanks:",
    ":yes-puppy:",
    ":focus-cat:",
    ":imfine:",
    ":dance_vibe:",
    ":pr:",
    ":elmofire:",
    ":rock2:",
  ];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};