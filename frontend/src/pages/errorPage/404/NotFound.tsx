import React, {useState, useEffect} from 'react';
import {Home, RefreshCw, ArrowLeft} from 'lucide-react';
import {Button} from "@material-tailwind/react";

const FloatingCircle: React.FC<{ index: number }> = ({index}) => (
  <div
    className="absolute bg-blue-500 opacity-5 rounded-full"
    style={{
      width: `${Math.random() * 300 + 100}px`,
      height: `${Math.random() * 300 + 100}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `gentleFloat ${20 + Math.random() * 10}s infinite ease-in-out`,
      animationDelay: `${index * 2}s`,
    }}
  />
);

const SearchProgress: React.FC<{ progress: number }> = ({progress}) => (
  <div className="w-full max-w-md mx-auto">
    <div className="h-2 w-full bg-slate-700 rounded-full mb-2">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150 ease-in-out"
        style={{width: `${progress}%`}}
      />
    </div>
    <p className="text-slate-400">正在搜尋頁面... {progress}%</p>
  </div>
);

const NavigationButtons: React.FC = () => (
  <div className="flex flex-wrap justify-center gap-4">
    <Button
      placeholder={undefined}
      variant="gradient"
      className="flex bg-slate-700 hover:bg-slate-600 text-white"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="mr-2 h-4 w-4"/>
      返回上一頁
    </Button>

    <Button
      placeholder={undefined}
      variant="gradient"
      className="flex bg-slate-700 hover:bg-slate-600 text-white"
      onClick={() => window.location.href = `${import.meta.env.VITE_APP_BASENAME ?? '/'}`}
    >
      <Home className="mr-2 h-4 w-4"/>
      返回首頁
    </Button>
  </div>
);

const NotFound: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);

  useEffect(() => {
    if (!isSearching) return;

    const interval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          setIsSearching(false);
          return 0;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSearching]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <FloatingCircle key={i} index={i}/>
        ))}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"/>
        <div
          className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 opacity-5 rounded-full blur-3xl"/>
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 max-w-3xl w-full px-4 text-center">
        <h1
          className="text-[10rem] font-bold mb-6 leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-gradientMove">
          404
        </h1>

        <div className="space-y-4 mb-12">
          <h2 className="text-4xl font-bold">頁面走丟了！</h2>
          <p className="text-xl text-slate-300">
            我們找不到您要尋找的頁面。它可能已被移動、刪除，或者從未存在過。
          </p>
        </div>

        <div className="mb-12">
          {isSearching ? (
            <SearchProgress progress={searchProgress}/>
          ) : (
            <Button
              placeholder={undefined}
              variant="gradient"
              onClick={() => setIsSearching(true)}
              className="flex bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <RefreshCw className="mr-2 h-4 w-4"/>
              再次搜尋
            </Button>
          )}
        </div>

        <NavigationButtons/>
      </div>

      {/* 底部裝飾 */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"/>
    </div>
  );
};

export default NotFound;