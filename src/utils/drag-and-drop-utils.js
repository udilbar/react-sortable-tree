import {
    DragDropContext as dragDropContext,
    DragSource as dragSource,
    DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from '../item-types';

const myDragSource = {
    beginDrag: (props) => {
        props.startDrag(props);

        return {
            path: props.path,
        };
    },

    endDrag: (props, monitor) => {
        props.endDrag(props, monitor.getDropResult());
    },
};

const myDropTarget = {
    drop: (props, _monitor) => {
        // TODO: use the offset to determine the path
        const { path } = props;
        return {
            path,
        };
    },

    hover(_props, _monitor) {
        // const { treeIndex: draggedId } = monitor.getItem();
        // const { treeIndex: overId } = props;

        // if (draggedId !== overId) {
        //     const { index: overIndex } = props.findCard(overId);
        //     props.moveCard(draggedId, overIndex);
        // }
    },

    canDrop(props, monitor) {
        // Cannot drag into a child path, and cannot drag into your current path
        return monitor.getItem().path
            .some((key, index) => (props.path[index] !== key));
    },
};

function dragSourcePropInjection(connect, monitor) {
    return {
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

function dropTargetPropInjection(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        canDrop:           monitor.canDrop(),
    };
}

export function dndWrapSource(el) {
    return dragSource(ItemTypes.HANDLE, myDragSource, dragSourcePropInjection)(el);
}

export function dndWrapTarget(el) {
    return dropTarget(ItemTypes.HANDLE, myDropTarget, dropTargetPropInjection)(el);
}

export function dndWrapRoot(el) {
    return dragDropContext(HTML5Backend)(el);
}
