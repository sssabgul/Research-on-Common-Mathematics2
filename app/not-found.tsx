import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <p className="text-[15px] font-bold text-[#007aff]">404</p>
      <h1 className="mt-2 text-[1.8rem] font-extrabold tracking-[-0.035em]">
        찾는 페이지가 없어요
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[1rem] leading-7 text-[#636366]">
        주소가 바뀌었거나 잘못된 링크일 수 있습니다. 처음 화면에서 대단원과
        소단원을 다시 골라보세요.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#007aff] px-5 font-bold text-white hover:bg-[#0068d7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
      >
        처음으로
      </Link>
    </section>
  );
}
