import Button from "@/components/ui/Button"
import React from 'react'

const TestPage = () => {
	return (
		<div className="pt-[200px] pl-[200px]">
			<Button variant="dark" size="md" leftIconBg="transparent" leftIcon={<span>🔥</span>}>
				CLAIM YOUR FREE GUIDE
			</Button>
		</div>
	)
}

export default TestPage