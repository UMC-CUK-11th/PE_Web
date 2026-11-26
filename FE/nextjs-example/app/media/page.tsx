import Image from "next/image";
import { GeistSans } from "geist/font/sans";

const imageUrl = "/sample.jpg";
export default function MediaPage() {
  return <><h1 className={GeistSans.className}>Hello, Next.js!</h1><div className="media-grid">
    <figure><figcaption>next/image 최적화 이미지</figcaption><Image src={imageUrl} alt="영화 배경 장면" width={600} height={338} sizes="(max-width: 700px) 100vw, 450px" /></figure>
    <figure><figcaption>img 원본 이미지</figcaption>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="같은 영화 배경 장면의 원본" width={600} height={338} />
    </figure>
  </div></>;
}
