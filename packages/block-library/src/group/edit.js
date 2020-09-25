/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	InnerBlocks,
	useInnerBlockWrapperProps,
	__experimentalUseBlockWrapperProps as useBlockWrapperProps,
} from '@wordpress/block-editor';
import { __experimentalBoxControl as BoxControl } from '@wordpress/components';
const { __Visualizer: BoxControlVisualizer } = BoxControl;

function GroupEdit( { attributes, clientId } ) {
	const hasInnerBlocks = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const block = getBlock( clientId );
			return !! ( block && block.innerBlocks.length );
		},
		[ clientId ]
	);
	const blockWrapperProps = useBlockWrapperProps();
	const { tagName: TagName = 'div' } = attributes;
	const innerBlockWrapperProps = useInnerBlockWrapperProps(
		{
			className: 'wp-block-group__inner-container',
		},
		{
			renderAppender: hasInnerBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<TagName { ...blockWrapperProps }>
			<BoxControlVisualizer
				values={ attributes.style?.spacing?.padding }
				showValues={ attributes.style?.visualizers?.padding }
			/>
			<div { ...innerBlockWrapperProps } />
		</TagName>
	);
}

export default GroupEdit;
