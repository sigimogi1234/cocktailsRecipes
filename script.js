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





// 필터 및 정렬 기능 (DOMContentLoaded 제거 버전)
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
setTimeout(() => {
    document.querySelectorAll('.mainSort li').forEach(mainItem => {
        mainItem.addEventListener('click', function () {
            // 1. mainSort 상태 초기화 및 설정
            document.querySelectorAll('.mainSort li').forEach(li => li.classList.remove('on'));
            this.classList.add('on');

            // 2. subSort 초기화
            document.querySelectorAll('.subSort .swiper').forEach(swiper => {
                swiper.classList.remove('on');
                swiper.querySelectorAll('.swiper-slide').forEach(slide => slide.classList.remove('on'));
            });

            // 3. 활성화할 타겟 클래스 추출
            const targetClass = Array.from(this.classList).find(cls =>
                ['all', 'base', 'glass', 'method', 'garnish', 'etc'].includes(cls)
            );
            if (!targetClass) return;

            // 4. subSwiper 활성화 및 첫 슬라이드 처리
            const subSwiper = document.querySelector(`.${targetClass}Sub`);
            if (subSwiper) {
                subSwiper.classList.add('on');
                const firstSlide = subSwiper.querySelector('.swiper-slide');
                if (firstSlide) {
                    firstSlide.classList.add('on');
                    const filterClass = Array.from(firstSlide.classList).find(cls => filterKeys.includes(cls));
                    if (filterClass) filterCards(filterClass);
                }
            }

            // 5. topic li on 클래스 처리 (모든 .card에 대해 처리)
            const topicMap = {
                base: 'baseTopic',
                glass: 'glassTopic',
                method: 'methodTopic',
                garnish: 'garnishTopic'
            };

            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                const topicItems = card.querySelectorAll('.imgWrap .topic li');
                topicItems.forEach(li => li.classList.remove('on')); // 모든 on 제거

                if (targetClass === 'all') {
                    topicItems.forEach(li => li.classList.add('on')); // 모두 on 추가
                } else if (topicMap[targetClass]) {
                    const matchedTopic = card.querySelector(`.imgWrap .topic li.${topicMap[targetClass]}`);
                    if (matchedTopic) matchedTopic.classList.add('on');
                }
            });
        });
    });





    // 2. 서브 swiper-slide 클릭
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', function () {
            const swiper = this.closest('.swiper');
            if (!swiper) return;

            swiper.querySelectorAll('.swiper-slide').forEach(s => s.classList.remove('on'));
            this.classList.add('on');

            const filterClass = Array.from(this.classList).find(cls => filterKeys.includes(cls));
            if (filterClass) filterCards(filterClass);
        });
    });





    // 검색기능
    const searchInput = document.querySelector('.searchInput');
    const cards = document.querySelectorAll('.cardWrap .card');
    const closeBtn = document.querySelector('.ic_close');

    function filterCardsBySearch(query) {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            const note = clone.querySelector('.note');
            if (note) note.remove();
            const textWithoutNote = clone.textContent.toLowerCase().trim();
            card.style.display = textWithoutNote.includes(query) ? '' : 'none';
        });
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        filterCardsBySearch(query);
        closeBtn.style.display = query !== '' ? 'block' : 'none';
    });

    closeBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterCardsBySearch('');
        closeBtn.style.display = 'none';
        searchInput.focus();
    });





    // 카테고리 스크롤 시 상단 고정 관련
    const sortWrap = document.querySelector('.sortWrap');
    const cardWrap = document.querySelector('.cardWrap');
    let lastScrollY = window.scrollY;

    function adjustCardWrapPadding() {
        if (sortWrap && cardWrap) {
            const navHeight = sortWrap.offsetHeight;
            cardWrap.style.paddingTop = `${navHeight}px`;
        }
    }

    const resizeObserver = new ResizeObserver(adjustCardWrapPadding);
    resizeObserver.observe(sortWrap);
    adjustCardWrapPadding();

    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        if (currentY > lastScrollY + 10) {
            sortWrap.classList.add('scrollHide');
        } else if (currentY < lastScrollY - 2) {
            sortWrap.classList.remove('scrollHide');
        }
        sortWrap.classList.toggle('scrolled', currentY > 0);
        lastScrollY = currentY;
    });





    // searchWrap 스크롤 이벤트
    const searchWrap = document.querySelector('.searchWrap');
    let lastSearchScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        if (currentY > lastSearchScrollY + 10) {
            searchWrap.classList.add('scrolled');
        } else if (currentY < lastSearchScrollY - 2) {
            searchWrap.classList.remove('scrolled');
        }
        lastSearchScrollY = currentY;
    });
}, 0);





// 카드 암기 버튼
document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    const completeBtnWrap = card.querySelector('.completeBtn');
    const titleWrap = card.querySelector('.titleWrap');
    const title = titleWrap.querySelector('.title');
    const titleEng = titleWrap.querySelector('.titleEng');

    // 초기 상태 로드
    const isFolded = localStorage.getItem(`folded_${id}`) === 'true';
    if (isFolded) {
        card.classList.add('folded');
        completeBtnWrap.classList.add('on');
    }

    // 버튼 클릭 시 동작
    completeBtnWrap.addEventListener('click', () => {
        const folded = card.classList.toggle('folded');
        completeBtnWrap.classList.toggle('on', folded);
        localStorage.setItem(`folded_${id}`, folded);
    });
});