export interface Product {
  id: string;
  name: string;
  viscosity: string;
  specifications: string[];
  packaging: {
    size: string;
    price: number;
    palletQty: number;
  }[];
  availability: 'in-stock' | 'pre-order' | 'out-of-stock';
  stockLevel?: number;
  description?: string;
  features?: string[];
  applications?: string[];
}

export interface Series {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  series: Series[];
}

export const catalogData: Category[] = [
  {
    id: 'motor-oils',
    name: 'Моторные масла',
    description: 'Полный ассортимент моторных масел MANNOL для различных типов двигателей',
    series: [
      {
        id: 'classic',
        name: 'Серия Classic',
        description: 'Классическая линейка масел для повседневного использования',
        products: [
          {
            id: 'MAN-001',
            name: 'MANNOL Classic 5W-30',
            viscosity: '5W-30',
            specifications: ['API SN/CF', 'ACEA A3/B4'],
            packaging: [
              { size: '1л', price: 450, palletQty: 900 },
              { size: '4л', price: 1250, palletQty: 240 },
              { size: '20л', price: 5800, palletQty: 48 },
              { size: '208л', price: 52000, palletQty: 4 }
            ],
            availability: 'in-stock',
            stockLevel: 1500,
            description: 'Универсальное моторное масло для бензиновых и дизельных двигателей',
            features: ['Защита от износа', 'Стабильная вязкость', 'Снижение расхода топлива'],
            applications: ['Легковые автомобили', 'Микроавтобусы', 'Коммерческий транспорт']
          },
          {
            id: 'MAN-002',
            name: 'MANNOL Classic 5W-40',
            viscosity: '5W-40',
            specifications: ['API SN/CF', 'ACEA A3/B4', 'MB 229.3'],
            packaging: [
              { size: '1л', price: 480, palletQty: 900 },
              { size: '4л', price: 1350, palletQty: 240 },
              { size: '20л', price: 6200, palletQty: 48 },
              { size: '208л', price: 55000, palletQty: 4 }
            ],
            availability: 'in-stock',
            stockLevel: 2200,
            description: 'Всесезонное масло с увеличенным интервалом замены',
            features: ['Высокая термостабильность', 'Защита турбокомпрессоров', 'Низкая испаряемость'],
            applications: ['Легковые автомобили', 'Внедорожники', 'Коммерческий транспорт']
          },
          {
            id: 'MAN-003',
            name: 'MANNOL Classic 10W-40',
            viscosity: '10W-40',
            specifications: ['API SN', 'ACEA A3/B3'],
            packaging: [
              { size: '1л', price: 420, palletQty: 900 },
              { size: '4л', price: 1150, palletQty: 240 },
              { size: '20л', price: 5400, palletQty: 48 },
              { size: '208л', price: 48000, palletQty: 4 }
            ],
            availability: 'in-stock',
            stockLevel: 800,
            description: 'Полусинтетическое масло для умеренного климата',
            features: ['Надежная защита двигателя', 'Экономичный вариант', 'Стабильная работа'],
            applications: ['Легковые автомобили', 'Микроавтобусы']
          },
          {
            id: 'MAN-004',
            name: 'MANNOL Classic 15W-40',
            viscosity: '15W-40',
            specifications: ['API SL/CF', 'ACEA A3/B3'],
            packaging: [
              { size: '1л', price: 400, palletQty: 900 },
              { size: '4л', price: 1100, palletQty: 240 },
              { size: '20л', price: 5200, palletQty: 48 },
              { size: '208л', price: 46000, palletQty: 4 }
            ],
            availability: 'in-stock',
            stockLevel: 650,
            description: 'Минеральное масло для жаркого климата',
            features: ['Защита при высоких температурах', 'Доступная цена', 'Универсальность'],
            applications: ['Легковые автомобили', 'Грузовой транспорт', 'Строительная техника']
          }
        ]
      },
      {
        id: 'extreme',
        name: 'Серия Extreme',
        description: 'Премиальная линейка для экстремальных условий эксплуатации',
        products: [
          {
            id: 'MAN-101',
            name: 'MANNOL Extreme 5W-30',
            viscosity: '5W-30',
            specifications: ['API SP', 'ACEA C3', 'BMW LL-04', 'MB 229.51'],
            packaging: [
              { size: '1л', price: 650, palletQty: 900 },
              { size: '4л', price: 2200, palletQty: 240 },
              { size: '20л', price: 10500, palletQty: 48 },
              { size: '208л', price: 95000, palletQty: 4 }
            ],
            availability: 'in-stock',
            stockLevel: 450,
            description: 'Полностью синтетическое масло с технологией Low SAPS',
            features: ['Защита сажевых фильтров', 'Экономия топлива', 'Экстремальная защита'],
            applications: ['Современные дизельные и бензиновые двигатели', 'Гибриды']
          },
          {
            id: 'MAN-102',
            name: 'MANNOL Extreme 5W-40',
            viscosity: '5W-40',
            specifications: ['API SN', 'ACEA A3/B4', 'VW 502.00/505.00'],
            packaging: [
              { size: '1л', price: 680, palletQty: 900 },
              { size: '4л', price: 2350, palletQty: 240 },
              { size: '20л', price: 11000, palletQty: 48 },
              { size: '208л', price: 98000, palletQty: 4 }
            ],
            availability: 'pre-order',
            description: 'Синтетическое масло для высоконагруженных двигателей',
            features: ['Молибденовые присадки', 'Защита турбин', 'Длительный интервал замены'],
            applications: ['Спортивные автомобили', 'Внедорожники', 'Коммерческий транспорт']
          },
          {
            id: 'MAN-103',
            name: 'MANNOL Extreme 0W-40',
            viscosity: '0W-40',
            specifications: ['API SP', 'ACEA A3/B4', 'Porsche A40'],
            packaging: [
              { size: '1л', price: 750, palletQty: 900 },
              { size: '4л', price: 2600, palletQty: 240 },
              { size: '20л', price: 12500, palletQty: 48 }
            ],
            availability: 'pre-order',
            description: 'Синтетическое масло для холодного климата',
            features: ['Легкий запуск в мороз', 'Максимальная защита', 'Премиум качество'],
            applications: ['Премиум автомобили', 'Спортивные авто', 'Северные регионы']
          }
        ]
      }
    ]
  },
  {
    id: 'transmission-oils',
    name: 'Трансмиссионные масла',
    description: 'Масла для механических и автоматических трансмиссий',
    series: [
      {
        id: 'atf',
        name: 'Серия ATF',
        description: 'Жидкости для автоматических коробок передач',
        products: [
          {
            id: 'MAN-201',
            name: 'MANNOL ATF Dexron III',
            viscosity: 'ATF',
            specifications: ['Dexron III', 'Mercon'],
            packaging: [
              { size: '1л', price: 520, palletQty: 900 },
              { size: '4л', price: 1850, palletQty: 240 },
              { size: '20л', price: 8500, palletQty: 48 }
            ],
            availability: 'in-stock',
            stockLevel: 350,
            description: 'Универсальная жидкость для АКПП',
            features: ['Плавное переключение', 'Защита от износа', 'Стабильность при нагреве'],
            applications: ['АКПП легковых автомобилей', 'Гидроусилители руля']
          },
          {
            id: 'MAN-202',
            name: 'MANNOL ATF AG55',
            viscosity: 'ATF',
            specifications: ['MB 236.14', 'VW G055025'],
            packaging: [
              { size: '1л', price: 680, palletQty: 900 },
              { size: '4л', price: 2400, palletQty: 240 }
            ],
            availability: 'in-stock',
            stockLevel: 120,
            description: 'Синтетическая жидкость для современных АКПП',
            features: ['Длительный срок службы', 'Низкотемпературная текучесть', 'Защита DSG'],
            applications: ['Современные АКПП VW/Audi/Mercedes', 'DSG коробки']
          }
        ]
      },
      {
        id: 'gear',
        name: 'Серия Gear',
        description: 'Масла для механических коробок передач и редукторов',
        products: [
          {
            id: 'MAN-301',
            name: 'MANNOL Gear 75W-90 GL-5',
            viscosity: '75W-90',
            specifications: ['API GL-5', 'MIL-L-2105D'],
            packaging: [
              { size: '1л', price: 480, palletQty: 900 },
              { size: '4л', price: 1700, palletQty: 240 },
              { size: '20л', price: 8000, palletQty: 48 }
            ],
            availability: 'in-stock',
            stockLevel: 280,
            description: 'Синтетическое масло для мостов и редукторов',
            features: ['Защита гипоидных передач', 'Работа в широком диапазоне температур', 'Снижение шума'],
            applications: ['Редукторы', 'Дифференциалы', 'Раздаточные коробки']
          }
        ]
      }
    ]
  },
  {
    id: 'additives',
    name: 'Присадки и очистители',
    description: 'Добавки для улучшения характеристик масел и топлива',
    series: [
      {
        id: 'additives-oil',
        name: 'Присадки в масло',
        description: 'Добавки для восстановления и защиты двигателя',
        products: [
          {
            id: 'MAN-401',
            name: 'MANNOL Motor Protector',
            viscosity: '-',
            specifications: ['Универсальная'],
            packaging: [
              { size: '0.5л', price: 650, palletQty: 1800 }
            ],
            availability: 'in-stock',
            stockLevel: 90,
            description: 'Защитная присадка с молибденом',
            features: ['Снижение износа на 50%', 'Антифрикционный эффект', 'Стабилизация вязкости'],
            applications: ['Бензиновые двигатели', 'Дизельные двигатели', 'Изношенные двигатели']
          },
          {
            id: 'MAN-402',
            name: 'MANNOL Oil Additive',
            viscosity: '-',
            specifications: ['Универсальная'],
            packaging: [
              { size: '0.3л', price: 450, palletQty: 3000 }
            ],
            availability: 'pre-order',
            description: 'Антидымная присадка для восстановления компрессии',
            features: ['Снижение дымности', 'Восстановление компрессии', 'Уменьшение расхода масла'],
            applications: ['Двигатели с большим пробегом', 'Моторы с повышенным расходом масла']
          }
        ]
      },
      {
        id: 'additives-fuel',
        name: 'Присадки в топливо',
        description: 'Очистители и улучшители топливной системы',
        products: [
          {
            id: 'MAN-501',
            name: 'MANNOL Injector Cleaner',
            viscosity: '-',
            specifications: ['Бензин'],
            packaging: [
              { size: '0.3л', price: 380, palletQty: 3000 }
            ],
            availability: 'in-stock',
            stockLevel: 150,
            description: 'Очиститель инжекторов бензиновых двигателей',
            features: ['Удаление нагара', 'Восстановление распыла', 'Снижение расхода'],
            applications: ['Бензиновые двигатели', 'Инжекторные системы']
          },
          {
            id: 'MAN-502',
            name: 'MANNOL Diesel Particulate Filter Cleaner',
            viscosity: '-',
            specifications: ['Дизель'],
            packaging: [
              { size: '1л', price: 850, palletQty: 900 }
            ],
            availability: 'in-stock',
            stockLevel: 45,
            description: 'Очиститель сажевых фильтров',
            features: ['Регенерация DPF', 'Снижение сажеобразования', 'Продление срока службы фильтра'],
            applications: ['Дизельные двигатели с DPF', 'Коммерческий транспорт']
          }
        ]
      }
    ]
  }
];

// Helper functions
export const getAllProducts = (): Product[] => {
  return catalogData.flatMap(category =>
    category.series.flatMap(series => series.products)
  );
};

export const getProductById = (id: string): Product | undefined => {
  return getAllProducts().find(p => p.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return catalogData.find(c => c.id === id);
};

export const getSeriesById = (categoryId: string, seriesId: string): Series | undefined => {
  const category = getCategoryById(categoryId);
  return category?.series.find(s => s.id === seriesId);
};

export const getProductPath = (productId: string): { category?: Category, series?: Series, product?: Product } => {
  for (const category of catalogData) {
    for (const series of category.series) {
      const product = series.products.find(p => p.id === productId);
      if (product) {
        return { category, series, product };
      }
    }
  }
  return {};
};
