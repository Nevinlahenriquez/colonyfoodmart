const { CompositionStage, RouteVideo } = window;

function RouteFilm() {
  return (
    <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#0B3B39">
      <RouteVideo />
    </CompositionStage>
  );
}

window.RouteFilm = RouteFilm;
