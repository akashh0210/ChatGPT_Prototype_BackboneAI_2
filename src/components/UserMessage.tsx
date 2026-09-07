interface Props {
  text: string
}

export default function UserMessage({ text }: Props) {
  return (
    <div className="flex justify-end mb-7">
      <div className="bg-[#303030] rounded-[18px] px-5 py-2.5 max-w-[70%] text-[#ECECEC] text-[16px] leading-relaxed">
        {text}
      </div>
    </div>
  )
}
