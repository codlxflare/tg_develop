import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import ModelViewer from './components/ModelViewer';

// Тестовые данные для застройщика "Премиум Девелопмент"
const DEVELOPER_DATA = {
  name: "Премиум Девелопмент",
  phone: "+7 (495) 123-45-67",
  email: "info@premium-dev.ru",
  projects: [
    {
      id: 1,
      name: "ЖК Премиум Парк",
      address: "Москва, Тверской район, ул. Петровка, 12",
      coordinates: [55.763338, 37.614069],
      price: "от 12 млн ₽",
      status: "Строящийся",
      deadline: "IV кв. 2025",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
      description: "Премиальный жилой комплекс в самом центре Москвы с уникальной архитектурой и развитой инфраструктурой.",
      amenities: ["Паркинг", "Детская площадка", "Спортзал", "Консьерж"],
      layouts: [
        { 
          id: 1, 
          rooms: 1, 
          area: 35, 
          price: 12000000, 
          floor: "3-15", 
          image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
          model3d: "models/apartment1.glb" 
        },
        { 
          id: 2, 
          rooms: 2, 
          area: 58, 
          price: 18500000, 
          floor: "3-20", 
          image: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab",
          model3d: "models/apartment2.glb" 
        },
        { 
          id: 3, 
          rooms: 3, 
          area: 82, 
          price: 26000000, 
          floor: "5-20", 
          image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
          model3d: "models/apartment1.glb" 
        }
      ]
    },
    {
      id: 2,
      name: "ЖК Московские Высоты",
      address: "Москва, Хамовники, Фрунзенская наб., 28",
      coordinates: [55.726887, 37.579895],
      price: "от 15 млн ₽",
      status: "Готов",
      deadline: "Сдан",
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      description: "Элитный жилой комплекс на Фрунзенской набережной с видом на Москву-реку.",
      amenities: ["SPA-центр", "Бассейн", "Паркинг", "Охрана 24/7"],
      layouts: [
        { 
          id: 4, 
          rooms: 2, 
          area: 65, 
          price: 19800000, 
          floor: "5-25", 
          image: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab",
          model3d: "models/apartment2.glb" 
        },
        { 
          id: 5, 
          rooms: 3, 
          area: 95, 
          price: 29500000, 
          floor: "8-25", 
          image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
          model3d: "models/apartment1.glb" 
        },
        { 
          id: 6, 
          rooms: 4, 
          area: 125, 
          price: 42000000, 
          floor: "10-25", 
          image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
          model3d: "models/apartment2.glb" 
        }
      ]
    },
    {
      id: 3,
      name: "ЖК Сокольники Резиденс",
      address: "Москва, Сокольники, Сокольническая площадь, 9",
      coordinates: [55.786804, 37.670798],
      price: "от 8 млн ₽",
      status: "Строящийся",
      deadline: "II кв. 2026",
      image: "https://images.unsplash.com/photo-1596654172710-9a63d72d134b",
      description: "Современный жилой комплекс рядом с парком Сокольники, идеальный для семей.",
      amenities: ["Детский сад", "Школа", "Магазины", "Паркинг"],
      layouts: [
        { 
          id: 7, 
          rooms: 1, 
          area: 42, 
          price: 8200000, 
          floor: "2-12", 
          image: "https://images.unsplash.com/photo-1721244654394-36a7bc2da288",
          model3d: "/models/apartment1.glb"
        },
        { 
          id: 8, 
          rooms: 2, 
          area: 68, 
          price: 13600000, 
          floor: "3-12", 
          image: "https://images.pexels.com/photos/7278770/pexels-photo-7278770.jpeg",
          model3d: "/models/apartment2.glb"
        },
        { 
          id: 9, 
          rooms: 3, 
          area: 89, 
          price: 18900000, 
          floor: "4-12", 
          image: "https://images.pexels.com/photos/31814919/pexels-photo-31814919.jpeg",
          model3d: "/models/apartment1.glb"
        }
      ]
    },
    {
      id: 4,
      name: "ЖК Арбат Престиж",
      address: "Москва, Арбат, Большой Афанасьевский пер., 15",
      coordinates: [55.751244, 37.593146],
      price: "от 20 млн ₽",
      status: "Готов",
      deadline: "Сдан",
      image: "https://images.pexels.com/photos/418285/pexels-photo-418285.jpeg",
      description: "Эксклюзивный жилой комплекс в историческом центре с авторским дизайном.",
      amenities: ["Консьерж", "Винный погреб", "Библиотека", "Терраса"],
      layouts: [
        { 
          id: 10, 
          rooms: 2, 
          area: 75, 
          price: 22500000, 
          floor: "3-8", 
          image: "https://images.pexels.com/photos/12739046/pexels-photo-12739046.jpeg",
          model3d: "/models/apartment2.glb"
        },
        { 
          id: 11, 
          rooms: 3, 
          area: 110, 
          price: 35000000, 
          floor: "4-8", 
          image: "https://images.unsplash.com/photo-1721244654346-9be0c0129e36",
          model3d: "/models/apartment1.glb"
        },
        { 
          id: 12, 
          rooms: 4, 
          area: 145, 
          price: 52000000, 
          floor: "5-8", 
          image: "https://images.unsplash.com/photo-1721244654394-36a7bc2da288",
          model3d: "/models/apartment2.glb"
        }
      ]
    },
    {
      id: 5,
      name: "ЖК Крылатские Холмы",
      address: "Москва, Крылатское, ул. Крылатские Холмы, 33",
      coordinates: [55.757761, 37.408447],  
      price: "от 9 млн ₽",
      status: "Строящийся",
      deadline: "III кв. 2025",
      image: "https://images.unsplash.com/photo-1570468495373-64af1677438f",
      description: "Жилой комплекс премиум-класса с живописным видом на Москву-реку и лесопарк.",
      amenities: ["Фитнес-центр", "Детские площадки", "Велопарковка", "Кафе"],
      layouts: [
        { 
          id: 13, 
          rooms: 1, 
          area: 38, 
          price: 9200000, 
          floor: "4-16", 
          image: "https://images.pexels.com/photos/7278770/pexels-photo-7278770.jpeg",
          model3d: "/models/apartment1.glb"
        },
        { 
          id: 14, 
          rooms: 2, 
          area: 62, 
          price: 14800000, 
          floor: "5-16", 
          image: "https://images.pexels.com/photos/31814919/pexels-photo-31814919.jpeg",
          model3d: "/models/apartment2.glb"
        },
        { 
          id: 15, 
          rooms: 3, 
          area: 85, 
          price: 21200000, 
          floor: "6-16", 
          image: "https://images.pexels.com/photos/12739046/pexels-photo-12739046.jpeg",
          model3d: "/models/apartment1.glb"
        }
      ]
    }
  ]
};

const INTERIOR_IMAGES = [
  "https://images.unsplash.com/photo-1560185007-5f0bb1866cab",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
];

// Компонент карты
const MapComponent = ({ onClose }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initMap = () => {
      if (window.ymaps && mapRef.current) {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map(mapRef.current, {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ['zoomControl', 'fullscreenControl']
          });

          const clusterer = new window.ymaps.Clusterer({
            preset: 'islands#blueClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
          });

          // Создаем глобальную функцию для навигации
          window.navigateToProject = (projectId) => {
            onClose(); // Закрываем карту перед навигацией
            navigate(`/project/${projectId}`);
          };

          const placemarks = DEVELOPER_DATA.projects.map(project => {
            const placemark = new window.ymaps.Placemark(
              project.coordinates,
              {
                balloonContentHeader: `<strong>${project.name}</strong>`,
                balloonContentBody: `
                  <div class="balloon-content">
                    <img src="${project.image}" alt="${project.name}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
                    <p><strong>Адрес:</strong> ${project.address}</p>
                    <p><strong>Цена:</strong> ${project.price}</p>
                    <p><strong>Статус:</strong> ${project.status}</p>
                    <p><strong>Срок сдачи:</strong> ${project.deadline}</p>
                    <button onclick="window.navigateToProject(${project.id})" 
                            style="background: #3B82F6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; margin-top: 8px; width: 100%;">
                      Подробнее
                    </button>
                  </div>
                `,
                clusterCaption: project.name
              },
              {
                preset: 'islands#blueIcon'
              }
            );
            return placemark;
          });

          clusterer.add(placemarks);
          map.geoObjects.add(clusterer);
          setMapInstance(map);
        });
      }
    };

    if (!mapInstance) {
      if (window.ymaps) {
        initMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=6905d86c-9f33-4753-a335-bec323c5f1e9&lang=ru_RU`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = initMap;
      }
    }

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [mapInstance, navigate, onClose]);

  // Очищаем глобальную функцию при размонтировании компонента
  useEffect(() => {
    return () => {
      delete window.navigateToProject;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Map Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-2 -ml-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Назад</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Карта объектов</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-[calc(100vh-64px)]"></div>

      {/* Map Legend */}
      {showLegend && (
        <div className="absolute bottom-20 left-4 bg-white rounded-xl shadow-lg p-4 max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">Наши объекты</h3>
            <button 
              onClick={() => setShowLegend(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Выберите объект на карте для подробной информации
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-xs text-gray-500">Объекты недвижимости</span>
          </div>
        </div>
      )}

      {/* Show Legend Button */}
      {!showLegend && (
        <button
          onClick={() => setShowLegend(true)}
          className="absolute bottom-20 left-4 bg-white rounded-xl shadow-lg p-3 hover:bg-gray-50"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Главная страница
const HomePage = () => {
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">ПД</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{DEVELOPER_DATA.name}</h1>
                <p className="text-xs text-gray-500">Недвижимость премиум-класса</p>
              </div>
            </div>
            <a 
              href={`tel:${DEVELOPER_DATA.phone}`} 
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Позвонить
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Найдите свой дом мечты</h2>
          <p className="text-blue-100">5 премиальных ЖК в лучших районах Москвы</p>
        </div>
        
        {/* Map Button */}
        <button
          onClick={() => setShowMap(true)}
          className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-2xl p-4 mb-4 hover:bg-opacity-30 transition-all"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold">Посмотреть на карте</div>
              <div className="text-sm text-blue-100">Все объекты с кластерами</div>
            </div>
            <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-xl font-bold">5</div>
            <div className="text-xs text-blue-100">ЖК</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-xl font-bold">15</div>
            <div className="text-xs text-blue-100">Планировок</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-xl font-bold">от 8м</div>
            <div className="text-xs text-blue-100">млн ₽</div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button className="flex-shrink-0 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            Все проекты
          </button>
          <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            Готовые
          </button>
          <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            Строящиеся
          </button>
          <button className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            до 15 млн
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-4 space-y-4">
        {DEVELOPER_DATA.projects.map(project => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
          >
            <div className="relative">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Готов' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-orange-500 text-white'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white font-bold">{project.price}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="truncate">{project.address.split(',').slice(1, 3).join(',')}</span>
                  </div>
                </div>
                <div className="text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Map Component */}
      {showMap && <MapComponent onClose={() => setShowMap(false)} />}
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
};

// Мобильная навигация
const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
        <div className="flex justify-around items-center">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Главная</span>
          </button>

          <button
            onClick={() => navigate('/layouts')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/layouts' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs mt-1">Планировки</span>
          </button>

          <button
            onClick={() => setShowMap(true)}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">Карта</span>
          </button>

          <button
            onClick={() => navigate('/contacts')}
            className={`flex flex-col items-center p-2 ${
              location.pathname === '/contacts' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-xs mt-1">Контакты</span>
          </button>
        </div>
      </div>

      {/* Map Component */}
      {showMap && <MapComponent onClose={() => setShowMap(false)} />}
    </>
  );
};

// Страница проекта  
const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [showContact, setShowContact] = useState(false);
  
  const project = DEVELOPER_DATA.projects.find(p => p.id === parseInt(id));
  
  if (!project) {
    return <div>Проект не найден</div>;
  }

  const filteredLayouts = selectedRoom === 'all' 
    ? project.layouts 
    : project.layouts.filter(layout => layout.rooms === parseInt(selectedRoom));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-1 -ml-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Назад</span>
            </button>
            <h1 className="text-sm font-semibold text-gray-900 truncate mx-4">{project.name}</h1>
            <button 
              onClick={() => setShowContact(true)}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
            >
              Показ
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-64">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-1">{project.name}</h1>
          <p className="text-white/90 text-sm">{project.address}</p>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-white mx-4 -mt-6 relative z-10 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{project.price}</div>
            <div className="text-xs text-gray-500">Цена</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{project.layouts.length}</div>
            <div className="text-xs text-gray-500">Планировок</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${project.status === 'Готов' ? 'text-green-600' : 'text-orange-600'}`}>
              {project.status}
            </div>
            <div className="text-xs text-gray-500">Статус</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{project.deadline}</div>
            <div className="text-xs text-gray-500">Срок</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">О проекте</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
          
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">Инфраструктура</h3>
            <div className="flex flex-wrap gap-2">
              {project.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Layouts Filter */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Планировки</h2>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все</option>
              <option value="1">1 комн.</option>
              <option value="2">2 комн.</option>
              <option value="3">3 комн.</option>
              <option value="4">4 комн.</option>
            </select>
          </div>

          {/* Layouts Grid */}
          <div className="space-y-3">
            {filteredLayouts.map(layout => (
              <Link
                key={layout.id}
                to={`/layout/${layout.id}`}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              >
                <img
                  src={layout.image}
                  alt={`Планировка ${layout.rooms} комн.`}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">
                    {layout.rooms} {layout.rooms === 1 ? 'комната' : layout.rooms < 5 ? 'комнаты' : 'комнат'}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Площадь: {layout.area} м²</div>
                    <div>Этажи: {layout.floor}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-blue-600">
                    {(layout.price / 1000000).toFixed(1)}м
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(layout.price / layout.area / 1000)}т/м²
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Галерея</h3>
          <div className="grid grid-cols-2 gap-2">
            {INTERIOR_IMAGES.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Интерьер ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center md:items-center">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md mx-4 mb-0 md:mb-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Записаться на показ</h3>
                <button
                  onClick={() => setShowContact(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Записаться на показ
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <MobileNavigation />
    </div>
  );
};

// Страница планировки
const LayoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plan');
  const [showContact, setShowContact] = useState(false);
  const [show3D, setShow3D] = useState(false);
  
  let layout = null;
  let project = null;
  
  for (const proj of DEVELOPER_DATA.projects) {
    const foundLayout = proj.layouts.find(l => l.id === parseInt(id));
    if (foundLayout) {
      layout = foundLayout;
      project = proj;
      break;
    }
  }
  
  if (!layout || !project) {
    return <div>Планировка не найдена</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/project/${project.id}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-1 -ml-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Назад</span>
            </button>
            <h1 className="text-sm font-semibold text-gray-900 text-center flex-1 mx-4">
              {layout.rooms}-комн • {layout.area} м²
            </h1>
            <button 
              onClick={() => setShowContact(true)}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
            >
              Купить
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'plan' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Планировка
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'details' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Детали
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'mortgage' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500'
            }`}
          >
            Ипотека
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Plan Tab */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            {/* Floor Plan */}
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">3D Планировка</h2>
                    <p className="text-sm text-gray-600">Нажмите для увеличения</p>
                  </div>
                  <button
                    onClick={() => setShow3D(!show3D)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {show3D ? '2D План' : '3D Вид'}
                  </button>
                </div>
              </div>
              <div className="relative">
                {show3D ? (
                  <ModelViewer modelUrl={layout.model3d || layout.image} />
                ) : (
                  <>
                    <img
                      src={layout.image}
                      alt="Планировка квартиры"
                      className="w-full h-80 object-contain bg-gray-50"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-white text-sm">Масштаб 1:100</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Interior Options */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Варианты отделки</h3>
              <div className="space-y-3">
                {INTERIOR_IMAGES.slice(0, 3).map((image, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                    <img
                      src={image}
                      alt={`Вариант отделки ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {index === 0 ? 'Эконом' : index === 1 ? 'Комфорт' : 'Премиум'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {index === 0 ? 'Базовая отделка' : index === 1 ? 'Улучшенная отделка' : 'Дизайнерская отделка'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        +{index === 0 ? '0' : index === 1 ? '500' : '1500'} тыс
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Specifications */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Характеристики</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Комнат:</span>
                  <span className="font-medium">{layout.rooms}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Общая площадь:</span>
                  <span className="font-medium">{layout.area} м²</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Жилая площадь:</span>
                  <span className="font-medium">{Math.round(layout.area * 0.7)} м²</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Кухня:</span>
                  <span className="font-medium">{Math.round(layout.area * 0.15)} м²</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Этажи:</span>
                  <span className="font-medium">{layout.floor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Высота потолков:</span>
                  <span className="font-medium">3.0 м</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Балкон/Лоджия:</span>
                  <span className="font-medium">да</span>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Стоимость</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Base price:</span>
                  <span className="font-medium">{(layout.price / 1000000).toFixed(1)} млн ₽</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">За м²:</span>
                  <span className="font-medium">{Math.round(layout.price / layout.area / 1000)} тыс ₽</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Отделка:</span>
                  <span className="font-medium">от 0 ₽</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-semibold text-blue-600">
                  <span>Итого:</span>
                  <span>{(layout.price / 1000000).toFixed(1)} млн ₽</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mortgage Tab */}
        {activeTab === 'mortgage' && (
          <div className="space-y-4">
            {/* Mortgage Calculator */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Калькулятор ипотеки</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Первоначальный взнос: 20%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    defaultValue="20"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span className="font-medium text-blue-600">
                      {(layout.price * 0.2 / 1000000).toFixed(1)} млн ₽
                    </span>
                    <span>50%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Срок кредита</label>
                  <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>10 лет</option>
                    <option>15 лет</option>
                    <option selected>20 лет</option>
                    <option>25 лет</option>
                    <option>30 лет</option>
                  </select>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Ежемесячный платеж</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((layout.price * 0.8) / (20 * 12) / 1000)} тыс ₽
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      при ставке 12% годовых
                    </div>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
                  Подать заявку на ипотеку
                </button>
              </div>
            </div>

            {/* Bank Partners */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Банки-партнеры</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                  <span className="font-medium">Сбербанк</span>
                  <span className="text-green-600 font-semibold">от 11.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                  <span className="font-medium">ВТБ</span>
                  <span className="text-green-600 font-semibold">от 11.8%</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                  <span className="font-medium">Альфа-Банк</span>
                  <span className="text-green-600 font-semibold">от 12.0%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-16 md:bottom-4 left-4 right-4 z-30">
        <div className="bg-white rounded-2xl shadow-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {(layout.price / 1000000).toFixed(1)} млн ₽
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(layout.price / layout.area / 1000)} тыс/м²
              </div>
            </div>
            <button 
              onClick={() => setShowContact(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center md:items-center">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md mx-4 mb-0 md:mb-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Забронировать квартиру</h3>
                <button
                  onClick={() => setShowContact(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                <div className="text-sm text-gray-600">{layout.rooms}-комн • {layout.area} м²</div>
                <div className="text-lg font-bold text-blue-600">
                  {(layout.price / 1000000).toFixed(1)} млн ₽
                </div>
              </div>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Забронировать за 50 000 ₽
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Бронь удерживается 7 дней без обязательств
              </p>
            </div>
          </div>
        </div>
      )}

      <MobileNavigation />
    </div>
  );
};

// Страница планировок
const LayoutsPage = () => {
  const [selectedRooms, setSelectedRooms] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Собираем все планировки
  const allLayouts = DEVELOPER_DATA.projects.flatMap(project => 
    project.layouts.map(layout => ({
      ...layout,
      projectName: project.name,
      projectId: project.id
    }))
  );

  // Фильтрация
  let filteredLayouts = allLayouts;
  
  if (selectedRooms !== 'all') {
    filteredLayouts = filteredLayouts.filter(layout => layout.rooms === parseInt(selectedRooms));
  }
  
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(x => parseInt(x) * 1000000);
    filteredLayouts = filteredLayouts.filter(layout => 
      layout.price >= min && (max ? layout.price <= max : true)
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900 text-center">Все планировки</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b p-4">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          <select
            value={selectedRooms}
            onChange={(e) => setSelectedRooms(e.target.value)}
            className="flex-shrink-0 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все комнаты</option>
            <option value="1">1 комната</option>
            <option value="2">2 комнаты</option>
            <option value="3">3 комнаты</option>
            <option value="4">4 комнаты</option>
          </select>
          
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="flex-shrink-0 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Любая цена</option>
            <option value="0-15">до 15 млн</option>
            <option value="15-25">15-25 млн</option>
            <option value="25-35">25-35 млн</option>
            <option value="35">от 35 млн</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <div className="text-sm text-gray-600 mb-4">
          Найдено {filteredLayouts.length} планировок
        </div>
        
        <div className="space-y-3">
          {filteredLayouts.map(layout => (
            <Link
              key={`${layout.projectId}-${layout.id}`}
              to={`/layout/${layout.id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={layout.image}
                  alt={`Планировка ${layout.rooms} комн.`}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">
                    {layout.rooms} {layout.rooms === 1 ? 'комната' : layout.rooms < 5 ? 'комнаты' : 'комнат'}
                  </h3>
                  <p className="text-sm text-gray-600">{layout.projectName}</p>
                  <div className="text-sm text-gray-600">
                    {layout.area} м² • Этажи: {layout.floor}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-blue-600">
                    {(layout.price / 1000000).toFixed(1)}м
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(layout.price / layout.area / 1000)}т/м²
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
};

const ContactsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900 text-center">Контакты</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">ПД</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{DEVELOPER_DATA.name}</h2>
            <p className="text-gray-600">Недвижимость премиум-класса</p>
          </div>

          <div className="space-y-4">
            <a 
              href={`tel:${DEVELOPER_DATA.phone}`}
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Позвонить</div>
                <div className="text-sm text-gray-600">{DEVELOPER_DATA.phone}</div>
              </div>
            </a>

            <a 
              href={`mailto:${DEVELOPER_DATA.email}`}
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Написать</div>
                <div className="text-sm text-gray-600">{DEVELOPER_DATA.email}</div>
              </div>
            </a>
          </div>
        </div>

        {/* Office Hours */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Режим работы</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Пн-Пт:</span>
              <span className="font-medium">9:00 - 20:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Сб-Вс:</span>
              <span className="font-medium">10:00 - 18:00</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Оставить заявку</h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="tel"
              placeholder="Телефон"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder="Ваш вопрос"
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Отправить заявку
            </button>
          </form>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.expand();
    
    // Set color scheme based on Telegram theme
    const setColorScheme = () => {
      const isDark = tg.colorScheme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.body.style.backgroundColor = isDark ? '#1f2937' : '#ffffff';
    };

    // Initial color scheme setup
    setColorScheme();

    // Listen for theme changes
    tg.onEvent('themeChanged', setColorScheme);

    return () => {
      tg.offEvent('themeChanged', setColorScheme);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-800">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/layout/:id" element={<LayoutPage />} />
          <Route path="/layouts" element={<LayoutsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;