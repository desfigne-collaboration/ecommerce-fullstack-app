// 카테고리별 데이터 설정

export const CATEGORY_DATA = {
  women: {
    name: "여성",
    nameEn: "WOMEN",
    totalCount: "580,227",
    subcategories: [
      { name: "전체", path: "/women", count: "580,227" },
      { name: "아우터", path: "/women/outer", count: "34,085" },
      { name: "재킷/베스트", path: "/women/jacket", count: "28,450" },
      { name: "니트", path: "/women/knit", count: "22,340" },
      { name: "셔츠/블라우스", path: "/women/shirt", count: "31,220" },
      { name: "티셔츠", path: "/women/tshirt", count: "45,670" },
      { name: "원피스", path: "/women/onepiece", count: "38,920" },
      { name: "팬츠", path: "/women/pants", count: "52,340" },
      { name: "스커트", path: "/women/skirt", count: "24,890" },
      { name: "라운지/언더웨어", path: "/women", count: "0" },
      { name: "비치웨어", path: "/women", count: "0" },
      { name: "패션잡화", path: "/women", count: "0" },
      { name: "슈얼리/시계", path: "/women", count: "0" },
      { name: "신상품", path: "/women/new", count: "12,450" },
    ],
    // 서브카테고리별 설정
    pages: {
      main: { title: "여성", count: "580,227" },
      outer: { title: "아우터", count: "34,085" },
      jacket: { title: "재킷/베스트", count: "28,450" },
      knit: { title: "니트", count: "22,340" },
      shirt: { title: "셔츠/블라우스", count: "31,220" },
      tshirt: { title: "티셔츠", count: "45,670" },
      onepiece: { title: "원피스", count: "38,920" },
      pants: { title: "팬츠", count: "52,340" },
      skirt: { title: "스커트", count: "24,890" },
      new: { title: "신상품", count: "12,450" },
    }
  },
  men: {
    name: "남성",
    nameEn: "MEN",
    totalCount: "420,150",
    subcategories: [
      { name: "전체", path: "/men", count: "420,150" },
      { name: "정장", path: "/men/suit", count: "15,230" },
      { name: "재킷", path: "/men/jacket", count: "22,340" },
      { name: "셔츠", path: "/men/shirt", count: "28,670" },
      { name: "니트", path: "/men/knit", count: "18,450" },
      { name: "티셔츠", path: "/men/tshirt", count: "38,920" },
      { name: "팬츠", path: "/men/pants", count: "45,670" },
      { name: "신상품", path: "/men/new", count: "10,220" },
    ],
    pages: {
      main: { title: "남성", count: "420,150" },
      suit: { title: "정장", count: "15,230" },
      jacket: { title: "재킷", count: "22,340" },
      shirt: { title: "셔츠", count: "28,670" },
      knit: { title: "니트", count: "18,450" },
      tshirt: { title: "티셔츠", count: "38,920" },
      pants: { title: "팬츠", count: "45,670" },
      new: { title: "신상품", count: "10,220" },
    }
  },
  kids: {
    name: "키즈",
    nameEn: "KIDS",
    totalCount: "180,320",
    subcategories: [
      { name: "전체", path: "/kids", count: "180,320" },
      { name: "남아", path: "/kids/boy", count: "65,420" },
      { name: "여아", path: "/kids/girl", count: "72,340" },
      { name: "베이비", path: "/kids/baby", count: "34,560" },
      { name: "신상품", path: "/kids/new", count: "8,000" },
    ],
    pages: {
      main: { title: "키즈", count: "180,320" },
      boy: { title: "남아", count: "65,420" },
      girl: { title: "여아", count: "72,340" },
      baby: { title: "베이비", count: "34,560" },
      new: { title: "신상품", count: "8,000" },
    }
  },
  sports: {
    name: "스포츠",
    nameEn: "SPORTS",
    totalCount: "250,890",
    subcategories: [
      { name: "전체", path: "/sports", count: "250,890" },
      { name: "아웃도어", path: "/sports/outdoor", count: "45,670" },
      { name: "러닝", path: "/sports/running", count: "38,920" },
      { name: "요가", path: "/sports/yoga", count: "22,340" },
      { name: "피트니스", path: "/sports/fitness", count: "31,220" },
      { name: "테니스", path: "/sports/tennis", count: "18,450" },
      { name: "수영", path: "/sports/swim", count: "15,230" },
      { name: "신상품", path: "/sports/new", count: "9,560" },
    ],
    pages: {
      main: { title: "스포츠", count: "250,890" },
      outdoor: { title: "아웃도어", count: "45,670" },
      running: { title: "러닝", count: "38,920" },
      yoga: { title: "요가", count: "22,340" },
      fitness: { title: "피트니스", count: "31,220" },
      tennis: { title: "테니스", count: "18,450" },
      swim: { title: "수영", count: "15,230" },
      new: { title: "신상품", count: "9,560" },
    }
  },
  beauty: {
    name: "뷰티",
    nameEn: "BEAUTY",
    totalCount: "89,450",
    subcategories: [
      { name: "전체", path: "/beauty", count: "89,450" },
      { name: "스킨케어", path: "/beauty/skin", count: "35,670" },
      { name: "메이크업", path: "/beauty/makeup", count: "28,920" },
      { name: "향수", path: "/beauty/perfume", count: "18,860" },
      { name: "신상품", path: "/beauty/new", count: "6,000" },
    ],
    pages: {
      main: { title: "뷰티", count: "89,450" },
      skin: { title: "스킨케어", count: "35,670" },
      makeup: { title: "메이크업", count: "28,920" },
      perfume: { title: "향수", count: "18,860" },
      new: { title: "신상품", count: "6,000" },
    }
  },
  golf: {
    name: "골프",
    nameEn: "GOLF",
    totalCount: "45,780",
    subcategories: [
      { name: "전체", path: "/golf", count: "45,780" },
      { name: "신상품", path: "/golf/new", count: "5,230" },
      { name: "여성", path: "/golf/women", count: "20,340" },
      { name: "남성", path: "/golf/men", count: "20,210" },
    ],
    pages: {
      main: { title: "골프", count: "45,780" },
      new: { title: "신상품", count: "5,230" },
      women: { title: "여성", count: "20,340" },
      men: { title: "남성", count: "20,210" },
    }
  },
  luxury: {
    name: "럭셔리",
    nameEn: "LUXURY",
    totalCount: "32,450",
    subcategories: [
      { name: "전체", path: "/luxury", count: "32,450" },
      { name: "신상품", path: "/luxury/new", count: "3,890" },
      { name: "여성", path: "/luxury/women", count: "15,670" },
      { name: "남성", path: "/luxury/men", count: "12,890" },
    ],
    pages: {
      main: { title: "럭셔리", count: "32,450" },
      new: { title: "신상품", count: "3,890" },
      women: { title: "여성", count: "15,670" },
      men: { title: "남성", count: "12,890" },
    }
  },
  shoes: {
    name: "백&슈즈",
    nameEn: "SHOES",
    totalCount: "78,920",
    subcategories: [
      { name: "전체", path: "/shoes", count: "78,920" },
      { name: "신상품", path: "/shoes/new", count: "8,450" },
      { name: "여성", path: "/shoes/women", count: "38,670" },
      { name: "남성", path: "/shoes/men", count: "31,800" },
    ],
    pages: {
      main: { title: "백&슈즈", count: "78,920" },
      new: { title: "신상품", count: "8,450" },
      women: { title: "여성", count: "38,670" },
      men: { title: "남성", count: "31,800" },
    }
  },
  life: {
    name: "라이프",
    nameEn: "LIFE",
    totalCount: "56,340",
    subcategories: [
      { name: "전체", path: "/life", count: "56,340" },
      { name: "신상품", path: "/life/new", count: "6,780" },
      { name: "가구/인테리어", path: "/life/furniture", count: "22,450" },
      { name: "반려동물", path: "/life/pet", count: "15,670" },
      { name: "자동차", path: "/life/car", count: "11,440" },
    ],
    pages: {
      main: { title: "라이프", count: "56,340" },
      new: { title: "신상품", count: "6,780" },
      furniture: { title: "가구/인테리어", count: "22,450" },
      pet: { title: "반려동물", count: "15,670" },
      car: { title: "자동차", count: "11,440" },
    }
  },
  outlet: {
    name: "아울렛",
    nameEn: "OUTLET",
    totalCount: "125,670",
    subcategories: [
      { name: "전체", path: "/outlet", count: "125,670" },
      { name: "여성", path: "/outlet/women", count: "35,890" },
      { name: "남성", path: "/outlet/men", count: "28,450" },
      { name: "키즈", path: "/outlet/kids", count: "12,340" },
      { name: "럭셔리", path: "/outlet/luxury", count: "8,920" },
      { name: "슈즈", path: "/outlet/shoes", count: "15,670" },
      { name: "스포츠", path: "/outlet/sports", count: "11,230" },
      { name: "골프", path: "/outlet/golf", count: "7,890" },
      { name: "라이프", path: "/outlet/life", count: "5,280" },
    ],
    pages: {
      main: { title: "아울렛", count: "125,670" },
      women: { title: "여성", count: "35,890" },
      men: { title: "남성", count: "28,450" },
      kids: { title: "키즈", count: "12,340" },
      luxury: { title: "럭셔리", count: "8,920" },
      shoes: { title: "슈즈", count: "15,670" },
      sports: { title: "스포츠", count: "11,230" },
      golf: { title: "골프", count: "7,890" },
      life: { title: "라이프", count: "5,280" },
    }
  },
};

export default CATEGORY_DATA;
