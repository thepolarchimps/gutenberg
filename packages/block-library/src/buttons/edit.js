/**
 * WordPress dependencies
 */
import {
	__experimentalAlignmentHookSettingsProvider as AlignmentHookSettingsProvider,
	useInnerBlocksProps,
	__experimentalUseBlockWrapperProps as useBlockWrapperProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { name as buttonBlockName } from '../button/';

const ALLOWED_BLOCKS = [ buttonBlockName ];
const BUTTONS_TEMPLATE = [ [ 'core/button' ] ];

// Inside buttons block alignment options are not supported.
const alignmentHooksSetting = {
	isEmbedButton: true,
};

function ButtonsEdit() {
	const blockWrapperProps = useBlockWrapperProps();
	const innerBlocksProps = useInnerBlocksProps( blockWrapperProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: BUTTONS_TEMPLATE,
		orientation: 'horizontal',
	} );
	return (
		<AlignmentHookSettingsProvider value={ alignmentHooksSetting }>
			<div { ...innerBlocksProps } />
		</AlignmentHookSettingsProvider>
	);
}

export default ButtonsEdit;
