const address = {
    local: "localhost:3000/event/",
    domain: "",
  };
const domain = (string: "local" | "domain") => address[string];

export const copyURL = async (eventID:number) => {
try {
    await navigator.clipboard.writeText(`${domain("local")}${eventID}`);
    console.log("클립보드에 링크가 복사되었습니다.");
} catch (e) {
    console.log("복사에 실패하였습니다");
}
};