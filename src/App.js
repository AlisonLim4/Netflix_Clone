import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import Header from './components/Header';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';

import './App.css';
const App = () => {
  const [movieList, setMovieList] = useState([]);

  //filme em destaque
  const [featuredData, setFeaturedData] = useState();

  //Controle de transparencia do Header
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista COMPLETA
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o filme em destaque
      let originals = list.filter((i) => i.slug === 'originals');
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1),
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);
  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        <p>
          Desenvolvido por{' '}
          <a href="https://www.linkedin.com/in/alison-lima/">Alison Lima.</a>
        </p>
        <p>Direitos de imagem para Netflix.</p>
        <p>Dados fornecidos pelo site Themoviedb.org</p>
      </footer>
      {movieList <= 0 && (
        <div className="loading">
          <img
            src="https://rchandru.com/images/portfolio/loading.gif"
            alt="Carregando"
          />
        </div>
      )}
    </div>
  );
};

export default App;
