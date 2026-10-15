// Precompiled from src/route-film.jsx (edit that file, then rebuild: see README)
const {
  CompositionStage,
  RouteVideo
} = window;
function RouteFilm() {
  return /*#__PURE__*/React.createElement(CompositionStage, {
    width: 1080,
    height: 1920,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: "#0B3B39"
  }, /*#__PURE__*/React.createElement(RouteVideo, null));
}
window.RouteFilm = RouteFilm;
