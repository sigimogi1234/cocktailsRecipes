// 스와이퍼
const swiper = new Swiper('.swiper', {
    freeMode: true,
    slidesPerView: "auto",
    on: {
        init: function () {
            updateFadeOverlay(this);
        },
        slideChange: function () {
            updateFadeOverlay(this);
        },
        resize: function () {
            updateFadeOverlay(this);
        },
        reachBeginning: function () {
            updateFadeOverlay(this);
        },
        reachEnd: function () {
            updateFadeOverlay(this);
        },
        fromEdge: function () {
            updateFadeOverlay(this);
        },
    },
});

// 스와이퍼 좌우에 페이드효과
function updateFadeOverlay(swiperInstance) {
    const container = swiperInstance.el.closest('.subSort');
    const leftFade = container.querySelector('.swiper-fade-left');
    const rightFade = container.querySelector('.swiper-fade-right');

    if (!leftFade || !rightFade) return;

    // console.log(swiperInstance.isBeginning, swiperInstance.isEnd); // 디버깅용

    if (swiperInstance.isBeginning) {
        leftFade.classList.add('fade-hidden');
    } else {
        leftFade.classList.remove('fade-hidden');
    }

    if (swiperInstance.isEnd) {
        rightFade.classList.add('fade-hidden');
    } else {
        rightFade.classList.remove('fade-hidden');
    }
}





document.addEventListener('DOMContentLoaded', function () {
    const filterKeys = ['allall', 'whk', 'brd', 'vka', 'gin', 'rum', 'teq', 'lqr', 'trd', 'win', 'vrg', 'cok', 'ofd', 'hbl', 'pls', 'col', 'sur', 'lqg', 'swg', 'wig', 'sss', 'fss', 'str', 'bld', 'shk', 'bnd', 'flt', 'chr', 'lms', 'aps', 'lmw', 'tlp', 'top', 'orsnchr', 'pawnchr', 'lmsnchr', 'olv', 'lim', 'nmc', 'ooo', 'ont', 'sgr', 'grs'];

    function filterCards(filterClass) {
        document.querySelectorAll('.cardWrap .card').forEach(card => {
            card.classList.remove('hide');
            if (filterClass !== 'allall' && !card.classList.contains(filterClass)) {
                card.classList.add('hide');
            }
        });
    }

    // 1. 메인 정렬 li 클릭
    document.querySelectorAll('.mainSort li').forEach(mainItem => {
        mainItem.addEventListener('click', function () {
            // 메인 메뉴 on 설정
            document.querySelectorAll('.mainSort li').forEach(li => li.classList.remove('on'));
            this.classList.add('on');

            // 모든 서브 swiper 숨김
            document.querySelectorAll('.subSort .swiper').forEach(swiper => {
                swiper.classList.remove('on');
                swiper.querySelectorAll('.swiper-slide').forEach(slide => slide.classList.remove('on'));
            });

            const targetClass = Array.from(this.classList).find(cls =>
                ['all', 'base', 'glass', 'method', 'garnish', 'etc'].includes(cls)
            );

            if (!targetClass) return;

            const subSwiper = document.querySelector(`.${targetClass}Sub`);
            if (subSwiper) {
                subSwiper.classList.add('on');

                const firstSlide = subSwiper.querySelector('.swiper-slide');
                if (firstSlide) {
                    firstSlide.classList.add('on');

                    const filterClass = Array.from(firstSlide.classList).find(cls =>
                        filterKeys.includes(cls)
                    );

                    if (filterClass) {
                        filterCards(filterClass);
                    }
                }
            }
        });
    });

    // 2. 서브 swiper-slide 클릭
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', function () {
            const swiper = this.closest('.swiper');
            if (!swiper) return;

            // 같은 swiper 내 모든 slide의 on 제거
            swiper.querySelectorAll('.swiper-slide').forEach(s => s.classList.remove('on'));
            this.classList.add('on');

            const filterClass = Array.from(this.classList).find(cls =>
                filterKeys.includes(cls)
            );

            if (filterClass) {
                filterCards(filterClass);
            }
        });
    });
});




// 카테고리 스크롤시 상단에 보임
(function () {
    const sortWrap = document.querySelector('.sortWrap');
    const cardWrap = document.querySelector('.cardWrap');

    let lastScrollY = window.scrollY;

    function adjustCardWrapPadding() {
        if (sortWrap && cardWrap) {
            const navHeight = sortWrap.offsetHeight;
            cardWrap.style.paddingTop = `${navHeight}px`;
        }
    }

    // 네비게이션 높이 변화를 감지
    const resizeObserver = new ResizeObserver(adjustCardWrapPadding);
    resizeObserver.observe(sortWrap);

    // 초기 패딩 적용
    adjustCardWrapPadding();

    // 스크롤 방향 감지 및 네비게이션 숨김/표시
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;

        if (currentY > lastScrollY + 10) {
            // 아래로 스크롤 → 숨김
            sortWrap.classList.add('scrollHide');
        } else if (currentY < lastScrollY - 2) {
            // 위로 스크롤 → 보임
            sortWrap.classList.remove('scrollHide');
        }

        if (currentY > 0) {
            sortWrap.classList.add('scrolled');
        } else {
            sortWrap.classList.remove('scrolled');
        }

        lastScrollY = currentY;
    });

    // 윈도우 리사이즈 시 패딩 재계산
    window.addEventListener('resize', adjustCardWrapPadding);
})();





// 검색창
const searchWrap = document.querySelector('.searchWrap');
const searchInput = searchWrap.querySelector('.searchInput');

searchWrap.addEventListener('click', () => {
    searchWrap.classList.toggle('active');

    if (searchWrap.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.blur();
    }
});

document.addEventListener('click', (e) => {
    if (!searchWrap.contains(e.target)) {
        searchWrap.classList.remove('active');
    }
});





// 검색기능
const searchInput2 = document.querySelector('.searchInput');
const cards = document.querySelectorAll('.cardWrap .card');

searchInput2.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
        // note 요소의 텍스트만 빼고 나머지만 추출
        const clone = card.cloneNode(true); // .card 복사
        const note = clone.querySelector('.note');
        if (note) note.remove(); // .note 제거

        const textWithoutNote = clone.textContent.toLowerCase().trim();

        // 검색어 포함 여부로 표시 제어
        card.style.display = textWithoutNote.includes(query) ? '' : 'none';
    });
});