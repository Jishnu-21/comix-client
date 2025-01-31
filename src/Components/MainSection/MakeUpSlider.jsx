import React, { useEffect, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../Assets/Css/MakeUpSlider.scss';
import SectionTitle from '../SectionTitle';

const MakeupSlider = () => {
  const sliderRef = useRef(null);
  const videoRefs = useRef([]);

  const videos = [
    'https://cdn.pixabay.com/video/2024/04/22/209022_large.mp4',
    'https://scontent.cdninstagram.com/o1/v/t16/f2/m86/AQNVeioEsmFbhXrj34JolSE2KYR_uQXU90klKjPqtnbxxmJszGswfQOYlI_Fj5-Xrd1UPP0CSN1b4GnIQg95bD9nBmv5F7jRL_FVxMw.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLnVua25vd24tQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSJ9&_nc_ht=scontent.cdninstagram.com&_nc_cat=111&vs=966125294901749_2369027697&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8zNDQyQjczQ0MzNkU4ODRCNEE3NTg2MTkxQTkzNjU4Ql92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dKLVBUQnljaTROdVRxVUJBTmJtRXNDS2pFMEVicV9FQUFBRhUCAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJqDGp53xrY1AFQIoAkMzLBdAJgAAAAAAABgSZGFzaF9iYXNlbGluZV8xX3YxEQB1AAA%3D&ccb=9-4&oh=00_AYDrr0UO3ADtTIvPWOada7PA9Grd2sMa0GQziLy_okRmMw&oe=679E4420&_nc_sid=1d576d',
    'https://scontent.cdninstagram.com/o1/v/t16/f2/m86/AQON6K1vRkA9yuaG1UgMH_c_KmsIDH_iOtAJhMJ0LZ49p7_3yqd3g1hp3RHsgTQu1xtZqVov-OREwfmFxSG_3mW26FZFz0MD-IDyR_0.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLnVua25vd24tQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSJ9&_nc_ht=scontent.cdninstagram.com&_nc_cat=106&vs=1939860309838751_1701024619&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9EMjQzOTc5RTg0MjY0OUM1MjZFNUUwODA2MUNDMzA4NV92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dISHhVaHktZFRFRWR5d2dBSEFxY3RWSEZiQm5icV9FQUFBRhUCAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJryUqpiJrJRAFQIoAkMzLBdAQ9U%2FfO2RaBgSZGFzaF9iYXNlbGluZV8xX3YxEQB1AAA%3D&ccb=9-4&oh=00_AYAr31oOgligolyMjK16-QQxnD9EjBX3OlpTdz7jhVOr1A&oe=679E5AD3&_nc_sid=1d576d',
    'https://scontent.cdninstagram.com/o1/v/t16/f2/m86/AQNHf-7-VwwykZEYhbdGKqfmK2M_G_AVkBneg0TRQ7f2e_HYcmN9pRQ-EwuTWAmn0txDsFBWmy_geE08NmmWlUw4r8W3ZNCcXJAPvBo.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLnVua25vd24tQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSJ9&_nc_ht=scontent.cdninstagram.com&_nc_cat=100&vs=1629090417700156_3310103348&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8zQzQ4QjE3NUI3QUY3REM5OUQ5RjY2Q0JERkQyNTA5Q192aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dNTndVeHlVMjdrcTNIMERBRWNUUjc4UmtvUXlicV9FQUFBRhUCAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJrTMvfqo17Y%2FFQIoAkMzLBdAQWZmZmZmZhgSZGFzaF9iYXNlbGluZV8xX3YxEQB1AAA%3D&ccb=9-4&oh=00_AYCFGvLzgvAAhmso-s1G_Zwv0QGzp9ZvFSNu6xMdL0OrMQ&oe=679E538D&_nc_sid=1d576d',
    'https://scontent.cdninstagram.com/o1/v/t16/f2/m86/AQM1gCTj0PcC6pThj9po0RrBA7mHQoTUAgK90JZY2Mnj-KOQMgr2XC3cubWPgdI97-gtv_HB87TKeyrvRGYJs7vUb8naJeZVVxiIqEU.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLnVua25vd24tQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSJ9&_nc_ht=scontent.cdninstagram.com&_nc_cat=108&vs=829376579325065_1001843651&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9DRjRDRjFBQzc1MTIxRUFDRkJDNDYzRUYyNzQ2NThBRF92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dJTHhUeHhubXhuTnlYa0hBTzlnRkpCeUJTQUJicV9FQUFBRhUCAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJqbh5%2BDn%2FKxAFQIoAkMzLBdALKp%2B%2Bdsi0RgSZGFzaF9iYXNlbGluZV8xX3YxEQB1AAA%3D&ccb=9-4&oh=00_AYDCdK9vcxTXCpqKTePWb3Mb3KahhiJ_9_xq4DE1-XGYIw&oe=679E3701&_nc_sid=1d576d',
    'https://scontent.cdninstagram.com/o1/v/t16/f2/m86/AQPDTxzYsB_aD_AUpUxNdmJf_CHcOwCVgkczS2CUFgi3TRhvWTJj-gqI2DkFajVtaNqMc_Dg0WzJoNjj-ivhl8KvTmb4wVy_367VtUU.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLnVua25vd24tQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSJ9&_nc_ht=scontent.cdninstagram.com&_nc_cat=102&vs=1285956805848233_4221493281&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8wMTQ4NkI1NjNGMzI0Mjk3MjE3MDQzNkMyREU4QzQ4RF92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dLLWhXaHl4YzhkLVh5NEVBT2FmeHJsTDlHZHNicV9FQUFBRhUCAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJqCJ7qPO4%2BA%2FFQIoAkMzLBdAIzMzMzMzMxgSZGFzaF9iYXNlbGluZV8xX3YxEQB1AAA%3D&ccb=9-4&oh=00_AYAWwF3VVPMiyZhYulHBFhNJck5irY-6MTqfGeK02IeajA&oe=679E4557&_nc_sid=1d576d',
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          swipeToSlide: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          swipeToSlide: true,
        }
      }
    ]
  };

  useEffect(() => {
    const handleVideoPlay = (video) => {
      if (!video) return;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (!video) return;

          if (entry.isIntersecting) {
            handleVideoPlay(video);
          } else {
            video.pause();
          }
        });
      },
      { 
        threshold: 0.5,
        root: null,
        rootMargin: '0px'
      }
    );

    videoRefs.current.forEach(video => {
      if (video) {
        observer.observe(video);
        video.addEventListener('loadedmetadata', () => {
          if (video.paused) {
            handleVideoPlay(video);
          }
        });
      }
    });

    return () => {
      observer.disconnect();
      videoRefs.current.forEach(video => {
        if (video) {
          video.removeEventListener('loadedmetadata', () => {});
        }
      });
    };
  }, []);

  return (
    <section className="comix-insta-section">
      <SectionTitle title="Commix INSTA" />
      <div className="comix-insta-wrapper">
        <Slider ref={sliderRef} {...settings}>
          {videos.map((videoUrl, index) => (
            <div key={index} className="comix-insta-slide">
              <div className="video-wrapper">
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default MakeupSlider;