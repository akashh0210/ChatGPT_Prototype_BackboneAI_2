interface Props {
  text: string
}

export default function UserMessage({ text }: Props) {
  return (
    <div className="flex justify-end mb-6">
      <div className="bg-[#2F2F3A] rounded-[18px] px-4 py-3 max-w-[70%] text-[#ECECF1] text-[15px] leading-relaxed">
        {text}
      </div>
    </div>
  )
}
