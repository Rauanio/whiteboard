import { useNodes } from './model/nodes';
import { useCanvasRect } from './hooks/use-canvas-rect';
import { useLayoutFocus } from './hooks/use-layout-focus';
import { useViewModel } from './view-model/view-model';
import { useWindowEvents } from './hooks/use-window-events';
import { Canvas } from './ui/canvas';
import { SelectionWindow } from './ui/selection-window';
import { Rectangle } from './ui/nodes/rectangle';
import { Sticker } from './ui/nodes/sticker';
import { Layout } from './ui/layout';
import { Overlay } from './ui/overlay';
import { useNodesDimensions } from './hooks/use-nodes-rects';
import { useWindowPositionModel } from './model/window-position';
import { Background } from './ui/background/background';
import { Actions } from './ui/actions';
import { Arrow } from './ui/nodes/arrow';
import { UndoRedoControls } from './ui/controls/undo-redo-controls';
import { ZoomControls } from './ui/controls/zoom-controls';
import { FreeHand } from './ui/nodes/free-hand';
import { useLockActions } from './model/lock-actions';
import { Circle } from './ui/nodes/circle';
import { Diamond } from './ui/nodes/diamond';
import { Hints } from './ui/hints';
import { Configurator } from './ui/configurator';

const BoardPage = () => {
  const nodesModel = useNodes();
  const layoutFocusRef = useLayoutFocus();
  const windowPositionModel = useWindowPositionModel();
  const lockActions = useLockActions();
  const { canvasRef, canvasRect } = useCanvasRect();
  const { nodeRef, nodesDimensions } = useNodesDimensions();

  const viewModel = useViewModel({
    canvasRect,
    nodesModel,
    nodesDimensions,
    windowPositionModel,
    lockActions,
  });

  useWindowEvents(viewModel);

  const windowPosition = viewModel.windowPosition ?? windowPositionModel.position;

  return (
    <Layout
      className={viewModel.layout?.cursor}
      ref={layoutFocusRef}
      onKeyDown={viewModel.layout?.onKeyDown}
    >
      <Background variant="lines" gap={30} windowPosition={windowPosition} />
      <Canvas
        overlay={
          <Overlay
            onMouseDown={viewModel.overlay?.onMouseDown}
            onMouseUp={viewModel.overlay?.onMouseUp}
            onClick={viewModel.overlay?.onClick}
          />
        }
        windowPosition={windowPosition}
        ref={canvasRef}
        onClick={viewModel.canvas?.onClick}
      >
        {viewModel.nodes.map((node) => {
          if (node.type === 'sticker') {
            return <Sticker key={node.id} ref={nodeRef} {...node} />;
          }
          if (node.type === 'rectangle') {
            return <Rectangle key={node.id} ref={nodeRef} {...node} />;
          }
          if (node.type === 'arrow') {
            return <Arrow key={node.id} ref={nodeRef} {...node} />;
          }
          if (node.type === 'free-hand') {
            return <FreeHand key={node.id} ref={nodeRef} {...node} />;
          }
          if (node.type === 'circle') {
            return <Circle key={node.id} ref={nodeRef} {...node} />;
          }
          if (node.type === 'diamond') {
            return <Diamond key={node.id} ref={nodeRef} {...node} />;
          }
        })}
        {viewModel.selectionWindow && <SelectionWindow {...viewModel.selectionWindow} />}
      </Canvas>
      <Actions actions={viewModel.actions} />
      <Configurator configurator={viewModel.configurator} />
      {viewModel.hints && <Hints hints={viewModel.hints} />}
      <div className="absolute bottom-4 right-4 flex gap-3">
        <UndoRedoControls
          undo={nodesModel.undo}
          redo={nodesModel.redo}
          canUndo={nodesModel.canUndo}
          canRedo={nodesModel.canRedo}
        />
        <ZoomControls canvasRect={canvasRect} windowPositionModel={windowPositionModel} />
      </div>
    </Layout>
  );
};

export const Component = BoardPage;
